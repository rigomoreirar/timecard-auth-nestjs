import { Module } from '@nestjs/common';
import { AppLogger } from './app.logger';
import { LoggerService } from './logger.service';
import { LoggerExceptionFilter } from './logger.filter';

@Module({
    providers: [AppLogger, LoggerService, LoggerExceptionFilter],
    exports: [AppLogger, LoggerExceptionFilter],
})
export class LoggerModule {}
