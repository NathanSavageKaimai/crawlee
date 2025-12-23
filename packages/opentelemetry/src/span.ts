/**
 * OpenTelemetry span wrapper for Crawlee.
 */

import type { SpanAttributes, SpanStatus, TelemetrySpan } from '@crawlee/types';
import { SpanStatusCode } from '@crawlee/types';
import type { Span as OTelSpan } from '@opentelemetry/api';
import { SpanStatusCode as OTelSpanStatusCode } from '@opentelemetry/api';

/**
 * Wraps an OpenTelemetry span to implement the Crawlee TelemetrySpan interface.
 */
export class OpenTelemetrySpan implements TelemetrySpan {
    constructor(private readonly span: OTelSpan) {}

    setAttribute(key: string, value: string | number | boolean): this {
        this.span.setAttribute(key, value);
        return this;
    }

    setAttributes(attributes: SpanAttributes): this {
        for (const [key, value] of Object.entries(attributes)) {
            if (value !== undefined) {
                this.span.setAttribute(key, value);
            }
        }
        return this;
    }

    setStatus(status: SpanStatus): this {
        let otelCode: OTelSpanStatusCode;

        switch (status.code) {
            case SpanStatusCode.OK:
                otelCode = OTelSpanStatusCode.OK;
                break;
            case SpanStatusCode.ERROR:
                otelCode = OTelSpanStatusCode.ERROR;
                break;
            default:
                otelCode = OTelSpanStatusCode.UNSET;
        }

        this.span.setStatus({ code: otelCode, message: status.message });
        return this;
    }

    recordException(exception: Error | string): void {
        if (typeof exception === 'string') {
            this.span.recordException(new Error(exception));
        } else {
            this.span.recordException(exception);
        }
    }

    end(): void {
        this.span.end();
    }

    getTraceId(): string {
        return this.span.spanContext().traceId;
    }

    getSpanId(): string {
        return this.span.spanContext().spanId;
    }

    isRecording(): boolean {
        return this.span.isRecording();
    }

    /**
     * Returns the underlying OpenTelemetry span.
     * Useful for advanced use cases requiring direct OTel API access.
     */
    getUnderlyingSpan(): OTelSpan {
        return this.span;
    }
}

