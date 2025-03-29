export interface LogMetadata {
    traceId: string;
    method?: string;
    errorMessage?: string;
    stack?: string;
    statusCode?: number;
    errorName?: string;
    timestamp?: string;
    level?: string;
    url?: string;
    originalUrl?: string;
    ip?: string;
    query?: Record<string, any>;
    body?: Record<string, any>;
    headers?: Record<string, string | string[]>;
    userAgent?: string;
}
