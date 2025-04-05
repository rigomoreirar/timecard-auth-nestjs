import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { LoggerModule } from 'src/logger/logger.module';
import { RefreshTokensModule } from 'src/refresh-tokens/refresh-tokens.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { RolesModule } from 'src/roles/roles.module';

@Module({
    imports: [
        DatabaseModule,
        LoggerModule,
        RolesModule,
        AuthModule,
        RefreshTokensModule,
    ],
    exports: [UsersRepository, UsersService],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
})
export class UsersModule {}
