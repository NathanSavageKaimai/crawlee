/**
 * OpenTelemetry instrumentation implementation for Crawlee.
 */

import type { SpanAttributes, SpanOptions, Telemetry, TelemetryConfig, TelemetrySpan } from '@crawlee/types';
import { SpanStatusCode } from '@crawlee/types';
import type { Context, Tracer } from '@opentelemetry/api';
import { context, SpanKind, trace } from '@opentelemetry/api';

import type { Log } from '@apify/log';

import { OpenTelemetryLogger } from './logger';
import { OpenTelemetrySpan } from './span';

/**
 * OpenTelemetry-based telemetry implementation for Crawlee.
 *
 * This class provides distributed tracing capabilities using OpenTelemetry,
 * allowing you to monitor and debug crawler execution across your infrastructure.
 */
export class OpenTelemetryInstrumentation implements Telemetry {
    readonly enabled: boolean;
    readonly config: TelemetryConfig;

    private readonly tracer: Tracer;
    private readonly collectLogs: boolean;

    constructor(config: TelemetryConfig) {
        this.config = config;
        this.enabled = config.enabled ?? true;
        this.collectLogs = config.collectLogs ?? true;

        this.tracer =
            config.tracer ??
            trace.getTracer(
                config.serviceName || 'crawlee',
                config.serviceVersion,
            );
    }

    startSpan(name: string, options?: SpanOptions): TelemetrySpan {
        if (!this.enabled) {
            return undefined as unknown as TelemetrySpan;
        }

        let parentContext: Context = context.active();

        if (options?.parent) {
            // If a parent span is provided, use its context
            const parentOtelSpan = (options.parent as OpenTelemetrySpan).getUnderlyingSpan?.();
            if (parentOtelSpan) {
                parentContext = trace.setSpan(context.active(), parentOtelSpan);
            }
        }

        // Always use the current active context (or the parent context if provided)
        // This ensures proper parent-child relationships in the trace hierarchy
        const span = this.tracer.startSpan(
            name,
            {
                kind: SpanKind.INTERNAL,
                attributes: options?.attributes as Record<string, string | number | boolean>,
            },
            parentContext,
        );

        return new OpenTelemetrySpan(span);
    }

    async withSpan<T>(name: string, fn: (span: TelemetrySpan) => Promise<T>, options?: SpanOptions): Promise<T> {
        const span = this.startSpan(name, options);

        if (!span) {
            // If telemetry is disabled, just run the function
            const noOpSpan = this.createNoOpSpan();
            return fn(noOpSpan);
        }

        const otelSpan = (span as OpenTelemetrySpan).getUnderlyingSpan();

        return context.with(trace.setSpan(context.active(), otelSpan), async () => {
            try {
                const result = await fn(span);
                span.setStatus({ code: SpanStatusCode.OK });
                return result;
            } catch (error) {
                span.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: error instanceof Error ? error.message : String(error),
                });
                if (error instanceof Error) {
                    span.recordException(error);
                }
                throw error;
            } finally {
                span.end();
            }
        });
    }

    async runInSpanContext<T>(span: TelemetrySpan, fn: () => Promise<T>): Promise<T> {
        if (!this.enabled) {
            return fn();
        }

        const otelSpan = (span as OpenTelemetrySpan).getUnderlyingSpan?.();
        if (!otelSpan) {
            return fn();
        }

        // Run the function within the span's context
        // This ensures any child spans created inside will have the correct parent
        return context.with(trace.setSpan(context.active(), otelSpan), fn);
    }

    getActiveSpan(): TelemetrySpan | undefined {
        if (!this.enabled) {
            return undefined;
        }

        const span = trace.getActiveSpan();
        if (span) {
            return new OpenTelemetrySpan(span);
        }
        return undefined;
    }

    addEvent(name: string, attributes?: SpanAttributes): void {
        if (!this.enabled) {
            return;
        }

        const span = trace.getActiveSpan();
        if (span) {
            span.addEvent(name, attributes as Record<string, string | number | boolean>);
        }
    }

    recordMetric(_name: string, _value: number, _attributes?: SpanAttributes): void {
        // Metrics are not implemented in this version
        // Future versions could add OpenTelemetry Metrics API support
    }

    /**
     * Returns the underlying OpenTelemetry tracer.
     * Useful for advanced use cases requiring direct OTel API access.
     */
    getTracer(): Tracer {
        return this.tracer;
    }

    private createNoOpSpan(): TelemetrySpan {
        return {
            setAttribute: () => this.createNoOpSpan(),
            setAttributes: () => this.createNoOpSpan(),
            setStatus: () => this.createNoOpSpan(),
            recordException: () => {},
            end: () => {},
            getTraceId: () => '',
            getSpanId: () => '',
            isRecording: () => false,
            addEvent: () => {},
        };
    }

    wrapLog(log: Log): Log {
        if (!this.collectLogs) {
            return log;
        }
        return new OpenTelemetryLogger(log, this);
    }
}

/**
 * Creates a new OpenTelemetry instrumentation instance.
 * This is the main entry point for the @crawlee/opentelemetry package.
 *
 * @param config - Configuration options for telemetry
 * @returns A configured Telemetry instance
 *
 * @example
 * ```typescript
 * import { createTelemetry } from '@crawlee/opentelemetry';
 *
 * const telemetry = createTelemetry({
 *     enabled: true,
 *     serviceName: 'my-crawler',
 *     serviceVersion: '1.0.0',
 * });
 * ```
 */
export function createTelemetry(config: TelemetryConfig): Telemetry {
    return new OpenTelemetryInstrumentation(config);
}
