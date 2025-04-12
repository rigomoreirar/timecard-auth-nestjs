import { Module } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { RepositoriesModule } from 'src/repositories/repositories.module';

@Module({
    imports: [RepositoriesModule],
    providers: [ValidationService],
    exports: [ValidationService],
})
export class ValidationModule {}
