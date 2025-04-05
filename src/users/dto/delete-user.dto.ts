import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDto {
    @IsString({ message: 'Client id must be a string' })
    @IsNotEmpty({ message: 'Client id is required' })
    clientId: string;
}
