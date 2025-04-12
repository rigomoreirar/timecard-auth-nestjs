import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RepositoriesModule } from 'src/repositories/repositories.module';
import { ValidationModule } from 'src/validation/validation.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [ValidationModule, RepositoriesModule, AuthModule],
    exports: [UsersService],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
