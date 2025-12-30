/**
 * OpenTelemetry integration types for Crawlee.
 * These interfaces define the contract between the core package (no-op stub)
 * and the optional @crawlee/opentelemetry package.
 */

import type { Log } from '@apify/log';

import type { Dictionary } from './utility-types';

/**
 * Span status codes following OpenTelemetry conventions.
 */
export enum SpanStatusCode {
    UNSET = 0,
    OK = 1,
    ERROR = 2,
}

/**
 * Span status interface.
 */
export interface SpanStatus {
    code: SpanStatusCode;
    message?: string;
}

/**
 * Span attributes - key-value pairs that provide context.
 */
export type SpanAttributes = Dictionary<string | number | boolean | undefined>;

/**
 * Represents a span in a distributed trace.
 * This is a simplified interface that matches OpenTelemetry's Span API.
 */
export interface TelemetrySpan {

    /** Adds an event to the span */
    addEvent(name: string, attributes?: SpanAttributes): void;

    /** Sets an attribute on the span */
    setAttribute(key: string, value: string | number | boolean): this;

    /** Sets multiple attributes on the span */
    setAttributes(attributes: SpanAttributes): this;

    /** Sets the status of the span */
    setStatus(status: SpanStatus): this;

    /** Records an exception/error on the span */
    recordException(exception: Error | string): void;

    /** Ends the span */
    end(): void;

    /** Returns the trace ID */
    getTraceId(): string;

    /** Returns the span ID */
    getSpanId(): string;

    /** Whether this span is recording */
    isRecording(): boolean;
}

/**
 * Options for creating a span.
 */
export interface SpanOptions {
    /** Attributes to set on the span */
    attributes?: SpanAttributes;

    /** Parent span to link to */
    parent?: TelemetrySpan;
}

/**
 * Configuration options for OpenTelemetry instrumentation.
 */
export interface TelemetryConfig {
    /**
     * Whether telemetry is enabled.
     * @default false
     */
    enabled?: boolean;

    /**
     * Service name for telemetry reporting.
     * Ignored if tracer is provided.
     * @default 'crawlee'
     */
    serviceName?: string;

    /**
     * Service version for telemetry reporting.
     * Ignored if tracer is provided.
     */
    serviceVersion?: string;

    /**
     * Tracer instance.
     * This replaces the default tracer.
     */
    tracer?: any; // Cannot properly type without OTEL type leakage

    /**
     * Wether to collect logs for telemetry.
     * @default true
     */
    collectLogs?: boolean;
}

/**
 * The main telemetry interface that provides tracing capabilities.
 * This is implemented by both the no-op stub and the actual OpenTelemetry package.
 */
export interface Telemetry {
    /** Whether telemetry is currently enabled and active */
    readonly enabled: boolean;

    /** The configuration used to initialize telemetry */
    readonly config: TelemetryConfig;

    /**
     * Creates and starts a new span.
     * Returns undefined if telemetry is disabled.
     */
    startSpan(name: string, options?: SpanOptions): TelemetrySpan;

    /**
     * Executes a function within a span context.
     * The span is automatically ended when the function completes.
     */
    withSpan<T>(name: string, fn: (span: TelemetrySpan) => Promise<T>, options?: SpanOptions): Promise<T>;

    /**
     * Runs a function within an existing span's context.
     * This allows child spans created inside to inherit the parent-child relationship.
     * The span is NOT ended by this method - you must call span.end() yourself.
     */
    runInSpanContext<T>(span: TelemetrySpan, fn: () => Promise<T>): Promise<T>;

    /**
     * Returns the current active span, if any.
     */
    getActiveSpan(): TelemetrySpan | undefined;

    /**
     * Adds an event to the current span.
     */
    addEvent(name: string, attributes?: SpanAttributes): void;

    /**
     * Records a metric value.
     */
    recordMetric(name: string, value: number, attributes?: SpanAttributes): void;

    /**
     * Wraps the log instance to collect logs for telemetry.
     */
    wrapLog(log: Log): Log;
}

/**
 * Function signature for the telemetry factory.
 * This is what @crawlee/opentelemetry exports as its main entry point.
 */
export type TelemetryFactory = (config: TelemetryConfig) => Telemetry;
