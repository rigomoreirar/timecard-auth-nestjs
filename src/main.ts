import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppLogger } from './logger/app.logger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: false });
    // const app = await NestFactory.create(AppModule);
    const logger = app.get(AppLogger);
    app.useLogger(logger);

    app.useGlobalPipes(new ValidationPipe());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
