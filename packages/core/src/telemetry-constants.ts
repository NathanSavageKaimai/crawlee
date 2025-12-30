/**
 * Telemetry constants for Crawlee.
 *
 * This module centralizes all span names, attribute names, and metric names
 * used throughout the Crawlee telemetry instrumentation to avoid magic strings.
 */

// ============================================================================
// SPAN NAMES
// ============================================================================

/**
 * Span names for crawler operations.
 */
export const CrawlerSpanNames = {
    /** Root span for the entire crawler run */
    CRAWLER_RUN: 'crawlee.crawler.run',

    /** Span for processing a single request */
    REQUEST_HANDLE: 'crawlee.request.handle',

    /** Span for user's request handler execution */
    REQUEST_HANDLER_USER: 'crawlee.request.handler.user',

    /** Span for request error handling */
    REQUEST_ERROR: 'crawlee.request.error',

    /** Span for failed request handler execution */
    REQUEST_FAILED_HANDLER: 'crawlee.request.failed_handler',

    /** Span for request reclaim operation */
    REQUEST_RECLAIM: 'crawlee.request.reclaim',

    /** Span for session rotation */
    SESSION_ROTATE: 'crawlee.session.rotate',

    /** Span for crawlee hooks */
    HOOKS: 'crawlee.hooks',

    /** Span for pre navigation hooks */
    PRE_NAVIGATION_HOOKS: 'crawlee.pre_navigation_hooks',

    /** Span for post navigation hooks */
    POST_NAVIGATION_HOOKS: 'crawlee.post_navigation_hooks',
} as const;

/**
 * Span names for request queue operations.
 */
export const QueueSpanNames = {
    /** Span for adding requests to queue */
    ENQUEUE: 'crawlee.queue.enqueue',

    /** Span for fetching requests from queue */
    DEQUEUE: 'crawlee.queue.dequeue',

    /** Span for reclaiming requests back to queue */
    RECLAIM: 'crawlee.queue.reclaim',

    /** Span for marking request as handled */
    MARK_HANDLED: 'crawlee.queue.mark_handled',

    /** Span for batch add requests */
    BATCH_ADD: 'crawlee.queue.batch_add',
} as const;

/**
 * Span names for browser operations.
 */
export const BrowserSpanNames = {
    /** Span for browser launch */
    LAUNCH: 'crawlee.browser.launch',

    /** Span for browser close */
    CLOSE: 'crawlee.browser.close',

    /** Span for page navigation */
    NAVIGATE: 'crawlee.browser.navigate',

    /** Span for page creation */
    PAGE_CREATE: 'crawlee.page.create',

    /** Span for page close */
    PAGE_CLOSE: 'crawlee.page.close',
} as const;

/**
 * Span names for HTTP operations.
 */
export const HttpSpanNames = {
    /** Span for HTTP request */
    REQUEST: 'crawlee.http.request',

    /** Span for HTTP navigation handling */
    NAVIGATION: 'crawlee.http.navigation',
} as const;

/**
 * Span names for storage operations.
 */
export const StorageSpanNames = {
    /** Span for dataset push operation */
    DATASET_PUSH: 'crawlee.storage.dataset.push',

    /** Span for dataset get operation */
    DATASET_GET: 'crawlee.storage.dataset.get',

    /** Span for key-value store get operation */
    KV_GET: 'crawlee.storage.kv.get',

    /** Span for key-value store set operation */
    KV_SET: 'crawlee.storage.kv.set',
} as const;

/**
 * Span names for autoscaling and system operations.
 */
export const SystemSpanNames = {
    /** Span for autoscaled pool run */
    AUTOSCALED_POOL_RUN: 'crawlee.autoscaled_pool.run',

    /** Span for system snapshot */
    SYSTEM_SNAPSHOT: 'crawlee.system.snapshot',

    /** Span for memory snapshot */
    MEMORY_SNAPSHOT: 'crawlee.system.memory_snapshot',
} as const;

// ============================================================================
// ATTRIBUTE NAMES
// ============================================================================

/**
 * Attribute names for crawler context.
 */
export const CrawlerAttributes = {
    /** Type of the crawler (e.g., 'PlaywrightCrawler', 'CheerioCrawler') */
    TYPE: 'crawlee.crawler.type',

    /** Crawler ID or name */
    NAME: 'crawlee.crawler.name',

    /** Maximum requests per crawl */
    MAX_REQUESTS_PER_CRAWL: 'crawlee.crawler.max_requests_per_crawl',

    /** Maximum concurrency setting */
    MAX_CONCURRENCY: 'crawlee.crawler.max_concurrency',
} as const;

/**
 * Attribute names for request context.
 */
export const RequestAttributes = {
    /** Request ID */
    ID: 'crawlee.request.id',

    /** Request URL */
    URL: 'crawlee.request.url',

    /** Request HTTP method */
    METHOD: 'crawlee.request.method',

    /** Request unique key */
    UNIQUE_KEY: 'crawlee.request.unique_key',

    /** Current retry count */
    RETRY_COUNT: 'crawlee.request.retry_count',

    /** Maximum allowed retries */
    MAX_RETRIES: 'crawlee.request.max_retries',

    /** Request crawl depth */
    DEPTH: 'crawlee.request.depth',

    /** Request state */
    STATE: 'crawlee.request.state',

    /** Request duration in milliseconds */
    DURATION_MS: 'crawlee.request.duration_ms',

    /** Request loaded URL (after redirects) */
    LOADED_URL: 'crawlee.request.loaded_url',
} as const;

/**
 * Attribute names for queue context.
 */
export const QueueAttributes = {
    /** Queue ID */
    ID: 'crawlee.queue.id',

    /** Queue name */
    NAME: 'crawlee.queue.name',

    /** Number of requests in operation */
    REQUEST_COUNT: 'crawlee.queue.request_count',

    /** Total queue size */
    SIZE: 'crawlee.queue.size',

    /** Pending request count */
    PENDING_COUNT: 'crawlee.queue.pending_count',

    /** Handled request count */
    HANDLED_COUNT: 'crawlee.queue.handled_count',
} as const;

/**
 * Attribute names for session context.
 */
export const SessionAttributes = {
    /** Session ID */
    ID: 'crawlee.session.id',

    /** Session rotation count */
    ROTATION_COUNT: 'crawlee.session.rotation_count',

    /** Session pool size */
    POOL_SIZE: 'crawlee.session.pool_size',
} as const;

/**
 * Attribute names for browser context.
 */
export const BrowserAttributes = {
    /** Browser type (e.g., 'chromium', 'firefox', 'webkit') */
    TYPE: 'crawlee.browser.type',

    /** Whether browser is running in headless mode */
    HEADLESS: 'crawlee.browser.headless',

    /** Browser ID */
    ID: 'crawlee.browser.id',

    /** Page ID */
    PAGE_ID: 'crawlee.page.id',

    /** Page URL */
    PAGE_URL: 'crawlee.page.url',
} as const;

/**
 * Attribute names for storage context.
 */
export const StorageAttributes = {
    /** Dataset ID */
    DATASET_ID: 'crawlee.storage.dataset.id',

    /** Dataset name */
    DATASET_NAME: 'crawlee.storage.dataset.name',

    /** Number of items in operation */
    ITEM_COUNT: 'crawlee.storage.item_count',

    /** Key-value store ID */
    KV_STORE_ID: 'crawlee.storage.kv.id',

    /** Key-value store name */
    KV_STORE_NAME: 'crawlee.storage.kv.name',

    /** Key-value store key */
    KV_KEY: 'crawlee.storage.kv.key',
} as const;

/**
 * Attribute names for error context.
 */
export const ErrorAttributes = {
    /** Error type/class name */
    TYPE: 'crawlee.error.type',

    /** Error message */
    MESSAGE: 'crawlee.error.message',

    /** Whether error is retryable */
    RETRYABLE: 'crawlee.error.retryable',
} as const;

/**
 * Attribute names for statistics/metrics context.
 */
export const StatisticsAttributes = {
    /** Total requests finished */
    REQUESTS_FINISHED: 'crawlee.stats.requests_finished',

    /** Total requests failed */
    REQUESTS_FAILED: 'crawlee.stats.requests_failed',

    /** Total request retries */
    REQUESTS_RETRIES: 'crawlee.stats.requests_retries',

    /** Requests finished per minute */
    REQUESTS_PER_MINUTE: 'crawlee.stats.requests_per_minute',

    /** Average request duration in milliseconds */
    AVG_DURATION_MS: 'crawlee.stats.avg_duration_ms',

    /** Minimum request duration in milliseconds */
    MIN_DURATION_MS: 'crawlee.stats.min_duration_ms',

    /** Maximum request duration in milliseconds */
    MAX_DURATION_MS: 'crawlee.stats.max_duration_ms',

    /** Total crawler runtime in milliseconds */
    RUNTIME_MS: 'crawlee.stats.runtime_ms',
} as const;

/**
 * Attribute names for system/resource context.
 */
export const SystemAttributes = {
    /** Memory usage in bytes */
    MEMORY_USED_BYTES: 'crawlee.system.memory_used_bytes',

    /** Memory usage ratio (0-1) */
    MEMORY_RATIO: 'crawlee.system.memory_ratio',

    /** Whether memory is overloaded */
    MEMORY_OVERLOADED: 'crawlee.system.memory_overloaded',

    /** CPU usage ratio (0-1) */
    CPU_RATIO: 'crawlee.system.cpu_ratio',

    /** Whether CPU is overloaded */
    CPU_OVERLOADED: 'crawlee.system.cpu_overloaded',

    /** Event loop delay in milliseconds */
    EVENT_LOOP_DELAY_MS: 'crawlee.system.event_loop_delay_ms',

    /** Whether event loop is overloaded */
    EVENT_LOOP_OVERLOADED: 'crawlee.system.event_loop_overloaded',

    /** Current concurrency */
    CONCURRENCY: 'crawlee.system.concurrency',

    /** Desired concurrency */
    DESIRED_CONCURRENCY: 'crawlee.system.desired_concurrency',
} as const;

// ============================================================================
// METRIC NAMES
// ============================================================================

/**
 * Metric names for statistics tracking.
 */
export const MetricNames = {
    /** Counter for requests started */
    REQUESTS_STARTED: 'crawlee.requests.started',

    /** Counter for requests finished successfully */
    REQUESTS_FINISHED: 'crawlee.requests.finished',

    /** Counter for requests failed */
    REQUESTS_FAILED: 'crawlee.requests.failed',

    /** Counter for request retries */
    REQUESTS_RETRIED: 'crawlee.requests.retried',

    /** Histogram for request duration */
    REQUEST_DURATION: 'crawlee.request.duration',

    /** Gauge for active/in-progress requests */
    REQUESTS_ACTIVE: 'crawlee.requests.active',

    /** Gauge for queue size */
    QUEUE_SIZE: 'crawlee.queue.size',

    /** Gauge for memory usage */
    MEMORY_USAGE: 'crawlee.memory.usage',

    /** Gauge for CPU usage */
    CPU_USAGE: 'crawlee.cpu.usage',

    /** Gauge for current concurrency */
    CONCURRENCY: 'crawlee.concurrency',
} as const;

// ============================================================================
// EVENT NAMES
// ============================================================================

/**
 * Telemetry event names for span events.
 */
export const TelemetryEventNames = {
    /** Event when a request starts processing */
    REQUEST_START: 'crawlee.request.start',

    /** Event when a request completes */
    REQUEST_COMPLETE: 'crawlee.request.complete',

    /** Event when a request fails */
    REQUEST_FAIL: 'crawlee.request.fail',

    /** Event when a request is retried */
    REQUEST_RETRY: 'crawlee.request.retry',

    /** Event when session is rotated */
    SESSION_ROTATED: 'crawlee.session.rotated',

    /** Event when crawler state is persisted */
    STATE_PERSISTED: 'crawlee.state.persisted',

    /** Event when crawler is migrating */
    MIGRATING: 'crawlee.migrating',

    /** Event when crawler is aborting */
    ABORTING: 'crawlee.aborting',
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/** All span name constants */
export type SpanName =
    | (typeof CrawlerSpanNames)[keyof typeof CrawlerSpanNames]
    | (typeof QueueSpanNames)[keyof typeof QueueSpanNames]
    | (typeof BrowserSpanNames)[keyof typeof BrowserSpanNames]
    | (typeof HttpSpanNames)[keyof typeof HttpSpanNames]
    | (typeof StorageSpanNames)[keyof typeof StorageSpanNames]
    | (typeof SystemSpanNames)[keyof typeof SystemSpanNames];

/** All attribute name constants */
export type AttributeName =
    | (typeof CrawlerAttributes)[keyof typeof CrawlerAttributes]
    | (typeof RequestAttributes)[keyof typeof RequestAttributes]
    | (typeof QueueAttributes)[keyof typeof QueueAttributes]
    | (typeof SessionAttributes)[keyof typeof SessionAttributes]
    | (typeof BrowserAttributes)[keyof typeof BrowserAttributes]
    | (typeof StorageAttributes)[keyof typeof StorageAttributes]
    | (typeof ErrorAttributes)[keyof typeof ErrorAttributes]
    | (typeof StatisticsAttributes)[keyof typeof StatisticsAttributes]
    | (typeof SystemAttributes)[keyof typeof SystemAttributes];
