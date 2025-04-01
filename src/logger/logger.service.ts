import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
import { LogMetadata } from './logger.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService implements NestLoggerService {
    private logger: Logger;

    constructor() {
        const logDir = path.resolve(__dirname, '../../api-logs');
        const exceptionDir = path.resolve(
            __dirname,
            '../../api-uncaught-exceptions',
        );

        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        if (!fs.existsSync(exceptionDir)) {
            fs.mkdirSync(exceptionDir, { recursive: true });
        }

        const logFileName = path.join(logDir, `app-logger.log`);
        const exceptionFileName = path.join(
            exceptionDir,
            `uncaught-exceptions.log`,
        );

        this.logger = createLogger({
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
            transports: [
                new transports.Console(),
                new transports.File({ filename: logFileName }),
            ],
            exceptionHandlers: [
                new transports.File({ filename: exceptionFileName }),
            ],
        });
    }

    log(message: LogMetadata) {
        this.logger.info(message);
    }

    error(message: LogMetadata) {
        this.logger.error(message);
    }

    warn(message: LogMetadata) {
        this.logger.warn(message);
    }

    debug?(message: LogMetadata) {
        this.logger.debug(message);
    }

    verbose?(message: LogMetadata) {
        this.logger.verbose(message);
    }
}
