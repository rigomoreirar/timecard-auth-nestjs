import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppLogger } from './logger/app.logger';
import { LoggerHttpExceptionFilter } from './logger/logger.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: false });
    // const app = await NestFactory.create(AppModule);
    const logger = app.get(AppLogger);

    app.useLogger(logger);

    app.useGlobalFilters(new LoggerHttpExceptionFilter(logger));

    app.useGlobalPipes(new ValidationPipe());
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
