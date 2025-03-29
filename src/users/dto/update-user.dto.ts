import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsEmail()
    @IsString({ message: 'Client email must be a string' })
    @IsOptional()
    email: string;

    @IsString({ message: 'Client id must be a string' })
    @IsNotEmpty({ message: 'Client id is required' })
    clientId: string;

    @IsString({ message: 'Client role must be a string' })
    @IsOptional()
    roleName: string;
}
