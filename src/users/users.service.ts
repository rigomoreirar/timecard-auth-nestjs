import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';

import { RefreshTokensRepository } from 'src/repositories/refresh-tokens.repository';
import { ValidationService } from 'src/validation/validation.service';
import { UsersRepository } from '../repositories/users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { ChangeUserSecretDto } from './dto/change-user-secret.dto';
import { RolesRepository } from 'src/repositories/roles.repository';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/auth.interface';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private config: ConfigService,
        private readonly rolesRepository: RolesRepository,
        private readonly authService: AuthService,
        private readonly refreshTokensRepository: RefreshTokensRepository,
        private readonly validationService: ValidationService,
    ) {}

    async getAll() {
        const users = await this.usersRepository.getAll();

        return users;
    }

    async getUserByClientId(clientId: string) {
        const user = await this.validationService.validateUserExists(clientId);

        return user;
    }

    async login(loginUserDto: LoginUserDto, response: Response) {
        const user = await this.usersRepository.getUserByClientId(
            loginUserDto.clientId,
        );

        if (!user) {
            throw new NotFoundException({
                message: 'User does not exist',
            });
        }
        const match = await bcrypt.compare(
            loginUserDto.password,
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

            const authUser: JwtPayload = {
                userId: user.id,
                role: roleName.name,
                clientId: user.clientId,
            };

            const token = this.authService.signAccessToken(authUser);

            let currentRefreshToken =
                await this.refreshTokensRepository.getByUserId(user.id);

            if (
                !currentRefreshToken ||
                currentRefreshToken.length === 0 ||
                !currentRefreshToken[0].isActive
            ) {
                const refreshToken: Prisma.RefreshTokenCreateInput = {
                    token: randomBytes(32).toString('hex'),
                    user: {
                        connect: { id: user.id },
                    },
                    isActive: true,
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                };

                currentRefreshToken = [
                    await this.refreshTokensRepository.save(refreshToken),
                ];
            }

            response.cookie('refreshToken', currentRefreshToken[0].token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: currentRefreshToken[0].expiresAt.getTime() - Date.now(),
            });

            if (roleName.name === 'webapp') {
                return {
                    message: 'User logged in successfully',
                    token: token,
                    user: {
                        clientId: user.clientId,
                        email: user.email,
                        role: roleName.name,
                    },
                };
            }

            return {
                message: 'User logged in successfully',
                refreshToken: currentRefreshToken[0].token,
                token: token,
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

        const role = await this.validationService.validateRoleName(
            registerUserDto.roleName,
        );

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
        const user = await this.validationService.validateUserPassword(
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
        const user = await this.validationService.validateUserExists(
            updateUserDto.clientId,
        );

        const role = await this.validationService.validateRoleName(
            updateUserDto.roleName,
        );

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
        const user = await this.validationService.validateUserExists(
            deleteUserDto.clientId,
        );

        await this.usersRepository.delete(user.clientId);

        return {
            message: 'User deleted successfully',
            user: {
                clientId: deleteUserDto.clientId,
            },
        };
    }

    async generateNewPasswordHash(password: string) {
        const saltRoundsStr = this.config.get<string>('BCRYPT_SALT_ROUNDS');

        const saltRounds = saltRoundsStr ? parseInt(saltRoundsStr, 10) : 10;

        return await bcrypt.hash(password, saltRounds);
    }
}
