import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersRepository } from './users.repository';
import { RolesRepository } from './roles.repository';
import { RefreshTokensRepository } from './refresh-tokens.repository';

@Module({
    imports: [DatabaseModule],
    providers: [UsersRepository, RolesRepository, RefreshTokensRepository],
    exports: [UsersRepository, RolesRepository, RefreshTokensRepository],
})
export class RepositoriesModule {}
