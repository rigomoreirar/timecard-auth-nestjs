import { forwardRef, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RolesRepository } from './roles.repository';
import { DatabaseModule } from 'src/database/database.module';
import { LoggerModule } from 'src/logger/logger.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [DatabaseModule, LoggerModule, forwardRef(() => UsersModule)],
    exports: [RolesService, RolesRepository],
    controllers: [RolesController],
    providers: [RolesService, RolesRepository],
})
export class RolesModule {}
