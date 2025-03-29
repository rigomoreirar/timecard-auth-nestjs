import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
    @IsString({ message: 'Role name must be a string' })
    @IsNotEmpty({ message: 'Role name is required' })
    name: string;
}
