import {
    Controller,
    Post,
    Body,
    Patch,
    Delete,
    Get,
    Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { ChangeUserSecretDto } from './dto/change-user-secret.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('')
    getAllUsers() {
        return this.usersService.getAll();
    }

    @Get('/:clientId')
    getUserByClientId(@Param('clientId') clientId: string) {
        return this.usersService.getUserByClientId(clientId);
    }

    @Post('/login')
    login(@Body() loginUserDto: LoginUserDto) {
        return this.usersService.login(loginUserDto);
    }

    @Post('/register')
    register(@Body() registerUserDto: RegisterUserDto) {
        return this.usersService.register(registerUserDto);
    }

    @Patch('/change-password')
    changeSecret(@Body() changeUserSecretDto: ChangeUserSecretDto) {
        return this.usersService.changeSecret(changeUserSecretDto);
    }

    @Patch('')
    update(@Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(updateUserDto);
    }

    @Delete('')
    delete(@Body() deleteUserDto: DeleteUserDto) {
        return this.usersService.delete(deleteUserDto);
    }
}
