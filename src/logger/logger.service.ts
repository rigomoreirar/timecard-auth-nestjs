import {
    Injectable,
    LoggerService as NestLoggerService,
    LogLevel,
} from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
import { LogMetadata } from './logger.interface';

type MessageOrMeta = string | LogMetadata;

@Injectable()
export class LoggerService implements NestLoggerService {
    private readonly logger: Logger;

    constructor() {
        this.logger = createLogger({
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
            transports: [
                new transports.Console(),
                new transports.File({ filename: 'api-logs/app-logger.log' }),
            ],
            exceptionHandlers: [
                new transports.File({
                    filename: 'api-uncaught-exceptions/exceptions.log',
                }),
            ],
        });
    }

    log(message: MessageOrMeta, context?: string) {
        if (typeof message === 'string') {
            this.logger.info(message, { context });
        } else {
            // structured metadata
            this.logger.info('request', message);
        }
    }

    error(message: MessageOrMeta, trace?: string, context?: string) {
        if (typeof message === 'string') {
            this.logger.error(message, { trace, context });
        } else {
            this.logger.error('exception', { ...message, trace });
        }
    }

    warn(message: MessageOrMeta, context?: string) {
        if (typeof message === 'string') {
            this.logger.warn(message, { context });
        } else {
            this.logger.warn('warning', message);
        }
    }

    debug?(message: MessageOrMeta, context?: string) {
        if (typeof message === 'string') {
            this.logger.debug(message, { context });
        } else {
            this.logger.debug('debug', message);
        }
    }

    verbose?(message: MessageOrMeta, context?: string) {
        if (typeof message === 'string') {
            this.logger.verbose(message, { context });
        } else {
            this.logger.verbose('verbose', message);
        }
    }

    setLogLevels?(levels: LogLevel[]) {
        if (levels.length) {
            this.logger.level = levels[0];
        }
    }
}
