import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { LoggerModule } from 'src/logger/logger.module';
import { RefreshTokensService } from './refresh-tokens.service';
import { RefreshTokensController } from './refresh-tokens.controller';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
    imports: [
        DatabaseModule,
        LoggerModule,
        AuthModule,
        forwardRef(() => UsersModule),
        RolesModule,
    ],
    controllers: [RefreshTokensController],
    providers: [RefreshTokensService, RefreshTokensRepository],
    exports: [RefreshTokensRepository],
})
export class RefreshTokensModule {}
