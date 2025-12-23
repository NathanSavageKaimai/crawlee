# @crawlee/opentelemetry

OpenTelemetry instrumentation for [Crawlee](https://crawlee.dev) - provides distributed tracing and observability for your web crawlers.

## Installation

```bash
npm install @crawlee/opentelemetry
# or
yarn add @crawlee/opentelemetry
```

You'll also need the OpenTelemetry dependencies (these are peer dependencies):

```bash
npm install @opentelemetry/api @opentelemetry/sdk-trace-node
```

## Quick Start

The easiest way to enable telemetry is through the `startTelemetry` function from `@crawlee/core`:

```typescript
import { startTelemetry, stopTelemetry } from '@crawlee/core';
import { PlaywrightCrawler } from 'crawlee';

// Start telemetry before creating the crawler
await startTelemetry({
    enabled: true,
    serviceName: 'my-crawler',
    serviceVersion: '1.0.0',
    // Export to console for debugging
    consoleExporter: true,
    // Or export to an OTLP endpoint (Jaeger, Zipkin, etc.)
    // otlpEndpoint: 'http://localhost:4318/v1/traces',
});

const crawler = new PlaywrightCrawler({
    requestHandler: async ({ page, request }) => {
        // Your crawling logic here
        const title = await page.title();
        console.log(`${request.url}: ${title}`);
    },
});

await crawler.run(['https://example.com']);

// Shut down telemetry to flush pending spans
await stopTelemetry();
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Whether telemetry is enabled |
| `serviceName` | `string` | `'crawlee'` | Service name for telemetry reporting |
| `serviceVersion` | `string` | `undefined` | Service version for telemetry reporting |
| `resourceAttributes` | `Record<string, string>` | `{}` | Additional resource attributes |
| `consoleExporter` | `boolean` | `false` | Export traces to console (useful for debugging) |
| `otlpEndpoint` | `string` | `undefined` | OTLP exporter endpoint URL |
| `otlpHeaders` | `Record<string, string>` | `{}` | OTLP exporter headers (e.g., for authentication) |

## Manual Span Creation

You can also create spans manually for custom operations:

```typescript
import { getTelemetry, SpanStatusCode } from '@crawlee/core';

const telemetry = getTelemetry();

// Create a span manually
const span = telemetry.startSpan('my-custom-operation', {
    attributes: {
        'custom.attribute': 'value',
    },
});

try {
    // Do some work
    await someAsyncOperation();
    span?.setStatus({ code: SpanStatusCode.OK });
} catch (error) {
    span?.recordException(error);
    span?.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    throw error;
} finally {
    span?.end();
}

// Or use the withSpan helper for automatic span lifecycle management
await telemetry.withSpan('another-operation', async (span) => {
    span.setAttribute('request.url', 'https://example.com');
    await fetch('https://example.com');
    // Span is automatically ended and marked as OK/ERROR
});
```

## Integration with Observability Backends

### Jaeger

```typescript
await startTelemetry({
    enabled: true,
    serviceName: 'my-crawler',
    otlpEndpoint: 'http://localhost:4318/v1/traces',
});
```

### Zipkin

```typescript
await startTelemetry({
    enabled: true,
    serviceName: 'my-crawler',
    otlpEndpoint: 'http://localhost:9411/api/v2/spans',
});
```

### Grafana Cloud / Tempo

```typescript
await startTelemetry({
    enabled: true,
    serviceName: 'my-crawler',
    otlpEndpoint: 'https://tempo-xxx.grafana.net/v1/traces',
    otlpHeaders: {
        'Authorization': 'Basic <base64-encoded-credentials>',
    },
});
```

## Span Naming Convention

The following span names are used by Crawlee when instrumentation is added to the crawlers:

- `crawlee.crawler.run` - Root crawler execution span
- `crawlee.request.handle` - Individual request handling
- `crawlee.request.error` - Request error handling
- `crawlee.queue.enqueue` - Request queue enqueue operation
- `crawlee.queue.dequeue` - Request queue dequeue operation
- `crawlee.browser.navigate` - Browser navigation
- `crawlee.browser.launch` - Browser launch
- `crawlee.storage.dataset.push` - Dataset push operation
- `crawlee.storage.kv.get` - Key-value store get operation
- `crawlee.storage.kv.set` - Key-value store set operation

## License

Apache-2.0

