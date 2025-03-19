export interface LogMetadata {
    traceId: string; // e.g. "1f94f1c7-c65f-4f54-82a2-78db685f12ed"
    message: string; // e.g. "Database error in getById"
    method: string; // e.g. "TimecardsRepository.getById"
    optionalParameter?: string; // or string, depending on your usage
    errorMessage?: string; // e.g. error.message
    stack?: string; // e.g. error.stack
}
