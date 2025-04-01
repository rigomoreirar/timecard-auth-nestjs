import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangeUserSecretDto {
    @IsString({ message: 'Client id must be a string' })
    @IsNotEmpty({ message: 'Client id is required' })
    clientId: string;

    @MinLength(6)
    @IsString({ message: 'Client old password must be a string' })
    @IsNotEmpty({ message: 'Client old password is required' })
    oldPassword: string;

    @MinLength(6)
    @IsString({ message: 'Client new password must be a string' })
    @IsNotEmpty({ message: 'Client new password is required' })
    newPassword: string;

    // @IsString({ message: 'Admin password must be a string' })
    // @IsNotEmpty({ message: 'Admin password is required' })
    // adminPassword: string;
}
