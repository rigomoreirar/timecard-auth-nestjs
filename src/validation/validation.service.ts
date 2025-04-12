import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RolesRepository } from 'src/repositories/roles.repository';
import { RefreshTokensRepository } from 'src/repositories/refresh-tokens.repository';
import { UsersRepository } from 'src/repositories/users.repository';

@Injectable()
export class ValidationService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly rolesRepository: RolesRepository,
        private readonly refreshTokensRepository: RefreshTokensRepository,
    ) {}

    async validateRefreshTokenId(refreshTokenId: number) {
        const refreshToken =
            await this.refreshTokensRepository.getById(refreshTokenId);

        if (!refreshToken) {
            throw new NotFoundException('Refresh token not found');
        }

        return refreshToken;
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

    async validateRoleId(roleId: number) {
        const role = await this.rolesRepository.getRoleById(roleId);

        if (!role) {
            throw new NotFoundException({
                message: 'Role does not exist',
            });
        } else {
            return role;
        }
    }
}
