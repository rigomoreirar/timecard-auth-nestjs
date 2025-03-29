import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { ChangeUserSecretDto } from './dto/change-user-secret.dto';
import { RolesRepository } from 'src/roles/roles.repository';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private config: ConfigService,
        private readonly rolesRepository: RolesRepository,
    ) {}

    async getAllUsers() {
        const users = await this.usersRepository.getAllUsers();

        return users;
    }

    async getUserByClientId(clientId: string) {
        const user = await this.validateUserExists(clientId);

        return user;
    }


    // Add this to the roles service and controller
    async getUsersByRoleName(roleName: string) {
        const role = await this.validateRoleName(roleName);

        const users = await this.usersRepository.getUsersByRoleId(role.id);

        return users;
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.usersRepository.getUserByClientId(
            loginUserDto.clientId,
        );

        if (!user) {
            throw new NotFoundException({
                message: 'User does not exist',
            });
        }
        const match = await bcrypt.compare(
            loginUserDto.clientSecret,
            user.passwordHash,
        );

        if (!match) {
            throw new NotFoundException({
                message: 'Password does not match',
            });
        } else {
            const roleName = await this.rolesRepository.getRoleById(
                user.roleId,
            );

            if (!roleName) {
                throw new NotFoundException({
                    message: 'Role does not exist',
                });
            }

            return {
                message: 'User logged in successfully',
                user: {
                    clientId: user.clientId,
                    email: user.email,
                    role: roleName.name,
                },
            };
        }
    }

    async register(registerUserDto: RegisterUserDto) {
        const hashedPassword = await this.generateNewPasswordHash(
            registerUserDto.password,
        );

        const role = await this.validateRoleName(registerUserDto.roleName);

        const newUser: Prisma.UserCreateInput = {
            clientId: registerUserDto.clientId,
            email: registerUserDto.email,
            passwordHash: hashedPassword,
            role: { connect: { id: Number(role.id) } },
        };

        await this.usersRepository.save(newUser);

        return {
            message: 'User registered successfully',
            user: {
                clientId: registerUserDto.clientId,
                email: registerUserDto.email,
                role: role.name,
            },
        };
    }

    async changeSecret(changeUserSecretDto: ChangeUserSecretDto) {
        const user = await this.validateUserPassword(
            changeUserSecretDto.clientId,
            changeUserSecretDto.oldPassword,
        );

        const newHashedPassword = await this.generateNewPasswordHash(
            changeUserSecretDto.newPassword,
        );

        const updatedUser: Prisma.UserUpdateInput = {
            passwordHash: newHashedPassword,
        };

        await this.usersRepository.update(
            changeUserSecretDto.clientId,
            updatedUser,
        );

        return {
            message: 'Password updated successfully',
            user: {
                clientId: changeUserSecretDto.clientId,
                email: user.email,
            },
        };
    }

    async update(updateUserDto: UpdateUserDto) {
        const user = await this.validateUserExists(updateUserDto.clientId);

        const role = await this.validateRoleName(updateUserDto.roleName);

        const updatedUser: Prisma.UserUpdateInput = {
            email: updateUserDto.email,
            passwordHash: user.passwordHash,
            role: { connect: { id: Number(role.id) } },
        };

        await this.usersRepository.update(updateUserDto.clientId, updatedUser);

        return {
            message: 'User updated successfully',
            user: {
                clientId: updateUserDto.clientId,
                email: updateUserDto.email,
                role: role.name,
            },
        };
    }

    async delete(deleteUserDto: DeleteUserDto) {
        const user = await this.validateUserExists(deleteUserDto.clientId);

        await this.usersRepository.delete(user.clientId);

        return {
            message: 'User deleted successfully',
            user: {
                clientId: deleteUserDto.clientId,
            },
        };
    }

    async validateUserExists(clientId: string) {
        const user = await this.usersRepository.getUserByClientId(clientId);

        if (!user) {
            throw new NotFoundException({
                message: 'User does not exist',
            });
        } else {
            return user;
        }
    }

    async validateUserPassword(clientId: string, password: string) {
        const user = await this.validateUserExists(clientId);

        const match = await bcrypt.compare(password, user.passwordHash);

        if (!match) {
            throw new NotFoundException({
                message: 'Incorrect password',
            });
        } else {
            return user;
        }
    }

    async generateNewPasswordHash(password: string) {
        const saltRounds = this.config.get<number>('BCRYPT_SALT_ROUNDS') || 10;

        return await bcrypt.hash(password, saltRounds);
    }

    async validateRoleName(roleName: string) {
        const role = await this.rolesRepository.getRoleByName(roleName);

        if (!role) {
            throw new NotFoundException({
                message: 'Role does not exist',
            });
        } else {
            return role;
        }
    }
}
