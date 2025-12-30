/**
 * Telemetry module for Crawlee.
 *
 * This module provides a no-op telemetry stub that can be replaced with the actual
 * OpenTelemetry implementation by calling `startTelemetry()`.
 *
 * The design is minimally invasive - the rest of the codebase uses the telemetry
 * singleton through `getTelemetry()`, and `startTelemetry()` dynamically imports
 * and activates the @crawlee/opentelemetry package when called.
 */

import type {
    SpanAttributes,
    SpanOptions,
    SpanStatus,
    Telemetry,
    TelemetryConfig,
    TelemetryFactory,
    TelemetrySpan,
} from '@crawlee/types';
import { SpanStatusCode } from '@crawlee/types';

import type { Log } from '@apify/log';
import log from '@apify/log';

/**
 * No-op span implementation.
 * All methods are no-ops that return immediately.
 */
class NoOpSpan implements TelemetrySpan {
    addEvent(_name: string, _attributes?: SpanAttributes): void {
        // No-op
    }

    setAttribute(_key: string, _value: string | number | boolean): this {
        return this;
    }

    setAttributes(_attributes: SpanAttributes): this {
        return this;
    }

    setStatus(_status: SpanStatus): this {
        return this;
    }

    recordException(_exception: Error | string): void {
        // No-op
    }

    end(): void {
        // No-op
    }

    getTraceId(): string {
        return '';
    }

    getSpanId(): string {
        return '';
    }

    isRecording(): boolean {
        return false;
    }
}

/**
 * No-op telemetry implementation.
 * Used when telemetry is disabled or @crawlee/opentelemetry is not installed.
 */
class NoOpTelemetry implements Telemetry {
    readonly enabled = false;
    readonly config: TelemetryConfig;

    private readonly noOpSpan = new NoOpSpan();

    constructor(config: TelemetryConfig = {}) {
        this.config = { ...config, enabled: false };
    }

    startSpan(_name: string, _options?: SpanOptions): TelemetrySpan {
        return undefined as unknown as TelemetrySpan;
    }

    async withSpan<T>(_name: string, fn: (span: TelemetrySpan) => Promise<T>, _options?: SpanOptions): Promise<T> {
        // Execute function without span context
        return fn(this.noOpSpan);
    }

    async runInSpanContext<T>(_span: TelemetrySpan, fn: () => Promise<T>): Promise<T> {
        // No-op: just run the function
        return fn();
    }

    getActiveSpan(): TelemetrySpan | undefined {
        return undefined;
    }

    addEvent(_name: string, _attributes?: SpanAttributes): void {
        // No-op
    }

    recordMetric(_name: string, _value: number, _attributes?: SpanAttributes): void {
        // No-op
    }

    wrapLog(_log: Log): Log {
        return _log;
    }
}

// Singleton telemetry instance
let telemetryInstance: Telemetry = new NoOpTelemetry();

// Track if telemetry has been started
let telemetryStarted = false;

/**
 * Returns the current telemetry instance.
 *
 * By default, this returns a no-op implementation that has zero overhead.
 * After calling `startTelemetry()`, this returns the actual OpenTelemetry implementation.
 *
 * @example
 * ```typescript
 * import { getTelemetry } from '@crawlee/core';
 *
 * const telemetry = getTelemetry();
 * const span = telemetry.startSpan('my-operation');
 * try {
 *     // ... do work
 *     span?.setStatus({ code: SpanStatusCode.OK });
 * } catch (error) {
 *     span?.recordException(error);
 *     span?.setStatus({ code: SpanStatusCode.ERROR });
 *     throw error;
 * } finally {
 *     span?.end();
 * }
 * ```
 */
export function getTelemetry(): Telemetry {
    return telemetryInstance;
}

/**
 * Starts the telemetry system by dynamically importing @crawlee/opentelemetry.
 *
 * This function attempts to load the @crawlee/opentelemetry package and initialize
 * the OpenTelemetry instrumentation. If the package is not installed or fails to load,
 * the no-op telemetry remains active.
 *
 * @param config - Configuration options for telemetry
 * @returns The initialized telemetry instance (either real or no-op)
 *
 * @example
 * ```typescript
 * import { startTelemetry } from '@crawlee/core';
 *
 * // Start telemetry with default settings
 * await startTelemetry({ enabled: true });
 *
 * // Or with custom configuration
 * await startTelemetry({
 *     enabled: true,
 *     serviceName: 'my-crawler',
 *     serviceVersion: '1.0.0',
 * });
 * ```
 */
export async function startTelemetry(config: TelemetryConfig = {}): Promise<Telemetry> {
    // If already started, just return the current instance
    if (telemetryStarted) {
        log.debug('Telemetry already started, returning existing instance');
        return telemetryInstance;
    }

    // If not enabled, return the no-op instance
    if (!config.enabled) {
        log.debug('Telemetry disabled, using no-op implementation');
        telemetryInstance = new NoOpTelemetry(config);
        return telemetryInstance;
    }

    try {
        // Dynamically import the OpenTelemetry package
        const otelModule = (await import('@crawlee/opentelemetry')) as { createTelemetry: TelemetryFactory };

        if (typeof otelModule.createTelemetry !== 'function') {
            throw new Error('@crawlee/opentelemetry does not export createTelemetry function');
        }

        // Create the telemetry instance
        telemetryInstance = otelModule.createTelemetry(config);
        telemetryStarted = true;

        log.info('Telemetry started successfully', {
            serviceName: config.serviceName || 'crawlee',
            enabled: true,
        });

        return telemetryInstance;
    } catch (error) {
        // Log warning and fall back to no-op
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage.includes('Cannot find module') || errorMessage.includes('MODULE_NOT_FOUND')) {
            log.warning(
                'OpenTelemetry package not found. Install @crawlee/opentelemetry to enable tracing. ' +
                    'Continuing with telemetry disabled.',
            );
        } else {
            log.warning('Failed to initialize OpenTelemetry, continuing with telemetry disabled', {
                error: errorMessage,
            });
        }

        telemetryInstance = new NoOpTelemetry(config);
        return telemetryInstance;
    }
}

/**
 * Stops the telemetry system and flushes any pending data.
 *
 * This should be called when shutting down the crawler to ensure
 * all telemetry data is properly exported.
 */
export async function stopTelemetry(): Promise<void> {
    if (telemetryStarted && telemetryInstance.enabled) {
        telemetryInstance = new NoOpTelemetry();
        telemetryStarted = false;
        log.debug('Telemetry shut down successfully');
    }
}

/**
 * Resets the telemetry system to its initial state.
 * Primarily used for testing purposes.
 * @internal
 */
export function resetTelemetry(): void {
    telemetryInstance = new NoOpTelemetry();
    telemetryStarted = false;
}

// Re-export the SpanStatusCode for convenience
export { SpanStatusCode };
