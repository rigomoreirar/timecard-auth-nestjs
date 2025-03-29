import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDto {
    @IsEmail()
    @IsString({ message: 'Client email must be a string' })
    @IsNotEmpty({ message: 'Client email is required' })
    email: string;

    @IsString({ message: 'Client id must be a string' })
    @IsNotEmpty({ message: 'Client id is required' })
    clientId: string;

    @IsString({ message: 'Admin Client Id must be a string' })
    @IsNotEmpty({ message: 'Admin Client Id is required' })
    adminClientId: string;

    @IsString({ message: 'Admin password must be a string' })
    @IsNotEmpty({ message: 'Admin password is required' })
    adminPassword: string;
}
