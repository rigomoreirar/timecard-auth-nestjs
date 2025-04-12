import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RepositoriesModule } from 'src/repositories/repositories.module';
import { ValidationModule } from 'src/validation/validation.module';

@Module({
    imports: [ValidationModule, RepositoriesModule],
    exports: [RolesService],
    controllers: [RolesController],
    providers: [RolesService],
})
export class RolesModule {}
