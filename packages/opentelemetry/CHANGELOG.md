# @crawlee/opentelemetry

## 3.15.3

### Initial Release

-   Added OpenTelemetry instrumentation package for Crawlee
-   Provides distributed tracing capabilities using OpenTelemetry
-   Supports OTLP exporters (Jaeger, Zipkin, Grafana Tempo, etc.)
-   Console exporter for debugging
-   Minimal overhead when disabled
-   Seamless integration with `@crawlee/core` via `startTelemetry()`

