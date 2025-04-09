import {
    Controller,
    Post,
    Body,
    Patch,
    Delete,
    Get,
    Param,
    UseGuards,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { ChangeUserSecretDto } from './dto/change-user-secret.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminRoleGuard } from 'src/common/guards/admin-role.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('')
    @UseGuards(AuthGuard('jwt'), AdminRoleGuard)
    getAllUsers() {
        return this.usersService.getAll();
    }

    @Get('/:clientId')
    @UseGuards(AuthGuard('jwt'), AdminRoleGuard)
    getUserByClientId(@Param('clientId') clientId: string) {
        return this.usersService.getUserByClientId(clientId);
    }

    @Post('/login')
    login(
        @Body() loginUserDto: LoginUserDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        return this.usersService.login(loginUserDto, response);
    }

    @Post('/register')
    @UseGuards(AuthGuard('jwt'), AdminRoleGuard)
    register(@Body() registerUserDto: RegisterUserDto) {
        return this.usersService.register(registerUserDto);
    }

    @Patch('/change-password')
    @UseGuards(AuthGuard('jwt'), AdminRoleGuard)
    changeSecret(@Body() changeUserSecretDto: ChangeUserSecretDto) {
        return this.usersService.changeSecret(changeUserSecretDto);
    }

    @Patch('')
    @UseGuards(AuthGuard('jwt'), AdminRoleGuard)
    update(@Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(updateUserDto);
    }

    @Delete('')
    @UseGuards(AuthGuard('jwt'), AdminRoleGuard)
    delete(@Body() deleteUserDto: DeleteUserDto) {
        return this.usersService.delete(deleteUserDto);
    }
}
