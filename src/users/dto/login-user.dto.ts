import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
    @IsString({ message: 'Client id must be a string' })
    @IsNotEmpty({ message: 'Client id is required' })
    clientId: string;

    @IsString({ message: 'Client secret must be a string' })
    @IsNotEmpty({ message: 'Client secret is required' })
    password: string;
}
