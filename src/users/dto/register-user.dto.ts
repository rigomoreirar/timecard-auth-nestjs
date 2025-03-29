import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
    @IsEmail()
    @IsString({ message: 'Client email must be a string' })
    @IsNotEmpty({ message: 'Client email is required' })
    email: string;

    @IsString({ message: 'Client role must be a string' })
    @IsNotEmpty({ message: 'Client role is required' })
    roleName: string;

    @IsString({ message: 'Client id must be a string' })
    @IsNotEmpty({ message: 'Client id is required' })
    clientId: string;

    @MinLength(6)
    @IsString({ message: 'Client password must be a string' })
    @IsNotEmpty({ message: 'Client password is required' })
    password: string;
}
