import {
    Catch,
    ExceptionFilter,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from './app.logger';

@Catch(HttpException)
export class LoggerHttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: AppLogger) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception.getStatus
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const traceId = this.logger.createTraceId();

        const logData = {
            traceId,
            timestamp: new Date().toISOString(),
            level: 'error',
            statusCode: status,
            errorMessage: exception.message,
            errorName: exception.name,
            stack: (exception as Error).stack,
            method: request.method,
            url: request.url,
            originalUrl: request.originalUrl,
            ip: request.ip || '',
            query: request.query as Record<string, any>,
            body: request.body as Record<string, any>,
            headers: request.headers as Record<string, string | string[]>,
            userAgent: request.get('user-agent'),
        };

        this.logger.error(logData);

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            traceId,
            path: request.url,
            message: exception.message,
        });
    }
}
