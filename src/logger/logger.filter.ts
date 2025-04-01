// file: logger-exception.filter.ts
import {
    Catch,
    ExceptionFilter,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from './app.logger';

@Catch() // No arguments => catch *all* exceptions
export class LoggerExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: AppLogger) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let exceptionResponse: unknown = {};
        let errorName = 'UnknownError';
        let stack: string | undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            exceptionResponse = exception.getResponse();
            errorName = exception.name;
            stack = exception.stack;
        } else if (exception instanceof Error) {
            errorName = exception.name;
            stack = exception.stack;
        }

        const traceId = this.logger.createTraceId();
        const timestamp = new Date().toISOString();

        const errorMessage = this.getDetailedError(exception);

        const responseBody: Record<string, unknown> = {
            statusCode: status,
            timestamp,
            traceId,
            path: request.url,
        };

        if (
            typeof exceptionResponse === 'object' &&
            exceptionResponse !== null
        ) {
            Object.assign(responseBody, exceptionResponse);
        } else if (typeof exceptionResponse === 'string') {
            Object.assign(responseBody, { message: exceptionResponse });
        }

        if (
            status === HttpStatus.INTERNAL_SERVER_ERROR &&
            !('message' in responseBody)
        ) {
            responseBody['message'] = 'Internal Server Error';
        }

        const logData = {
            traceId,
            timestamp,
            level: 'error',
            statusCode: status,
            errorName,
            errorMessage,
            stack,
            method: request.method,
            url: request.url,
            originalUrl: request.originalUrl,
            ip: request.ip ?? '',
            query: request.query as Record<string, unknown>,
            body: request.body as Record<string, unknown>,
            headers: request.headers as Record<string, string | string[]>,
            userAgent: request.get('user-agent'),
            requestBody: request.body as Record<string, unknown>,
            responseBody,
        };

        this.logger.error(logData);

        response.status(status).json(responseBody);
    }

    private getDetailedError(exception: unknown): string {
        if (exception instanceof Error) {
            return exception.message;
        }
        try {
            return JSON.stringify(exception);
        } catch {
            return String(exception);
        }
    }
}
