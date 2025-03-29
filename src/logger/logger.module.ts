import { Module } from '@nestjs/common';
import { AppLogger } from './app.logger';
import { LoggerService } from './logger.service';
import { LoggerHttpExceptionFilter } from './logger.filter';

@Module({
    providers: [AppLogger, LoggerService, LoggerHttpExceptionFilter],
    exports: [AppLogger, LoggerHttpExceptionFilter],
})
export class LoggerModule {}
