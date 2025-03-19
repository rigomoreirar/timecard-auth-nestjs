import { Module } from '@nestjs/common';
import { AppLogger } from './app.logger';
import { LoggerService } from './logger.service';

@Module({
    providers: [AppLogger, LoggerService],
    exports: [AppLogger],
})
export class LoggerModule {}
