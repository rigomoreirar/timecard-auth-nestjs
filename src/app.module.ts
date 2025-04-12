import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './logger/logger.module';
import { RolesModule } from './roles/roles.module';
import { DatabaseModule } from './database/database.module';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';
import { ValidationModule } from './validation/validation.module';
import { RepositoriesModule } from './repositories/repositories.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        LoggerModule,
        AuthModule,
        UsersModule,
        RolesModule,
        DatabaseModule,
        RefreshTokensModule,
        ValidationModule,
        RepositoriesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
