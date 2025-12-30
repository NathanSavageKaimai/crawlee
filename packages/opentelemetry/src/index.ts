/**
 * @crawlee/opentelemetry - OpenTelemetry instrumentation for Crawlee
 *
 * This package provides distributed tracing and observability for Crawlee crawlers
 * using OpenTelemetry. It allows you to monitor crawler execution, track request
 * processing, and debug issues across distributed systems.
 *
 * ## Installation
 *
 * ```bash
 * npm install @crawlee/opentelemetry
 * # or
 * yarn add @crawlee/opentelemetry
 * ```
 *
 * ## Usage
 *
 * The easiest way to enable telemetry is through the `startTelemetry` function
 * from `@crawlee/core`:
 *
 * ```typescript
 * import { startTelemetry } from '@crawlee/core';
 * import { PlaywrightCrawler } from 'crawlee';
 *
 * // Start telemetry before creating the crawler
 * await startTelemetry({
 *     enabled: true,
 *     serviceName: 'my-crawler',
 *     serviceVersion: '1.0.0',
 *     otlpEndpoint: 'http://localhost:4318/v1/traces',
 * });
 *
 * const crawler = new PlaywrightCrawler({
 *     // ... your configuration
 * });
 *
 * await crawler.run(['https://example.com']);
 * ```
 *
 * ## Configuration Options
 *
 * - `enabled` - Whether telemetry is enabled (default: false)
 * - `serviceName` - Service name for telemetry reporting (default: 'crawlee')
 * - `serviceVersion` - Service version for telemetry reporting
 * - `resourceAttributes` - Additional resource attributes
 * - `consoleExporter` - Export traces to console for debugging
 * - `otlpEndpoint` - OTLP exporter endpoint URL
 * - `otlpHeaders` - OTLP exporter headers (e.g., for authentication)
 *
 * @module @crawlee/opentelemetry
 */

export { createTelemetry, OpenTelemetryInstrumentation } from './instrumentation';
export { OpenTelemetrySpan } from './span';

// Re-export types for convenience
export type {
    Telemetry,
    TelemetryConfig,
    TelemetrySpan,
    SpanAttributes,
    SpanOptions,
    SpanStatus,
    TelemetryFactory,
} from '@crawlee/types';
export { SpanStatusCode } from '@crawlee/types';
