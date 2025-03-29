import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { DatabaseModule } from 'src/database/database.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
    imports: [DatabaseModule, LoggerModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
})
export class UsersModule {}
