import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @IsString({ message: 'Role name must be a string' })
    @IsNotEmpty({ message: 'Role name is the only updatable value' })
    name: string;
}
