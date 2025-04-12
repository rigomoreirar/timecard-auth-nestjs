import { Module } from '@nestjs/common';
import { RefreshTokensService } from './refresh-tokens.service';
import { RefreshTokensController } from './refresh-tokens.controller';
import { RepositoriesModule } from 'src/repositories/repositories.module';
import { ValidationModule } from 'src/validation/validation.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [ValidationModule, RepositoriesModule, AuthModule],
    controllers: [RefreshTokensController],
    providers: [RefreshTokensService],
})
export class RefreshTokensModule {}
