import { Injectable, NotFoundException } from '@nestjs/common';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { UsersRepository } from 'src/users/users.repository';
import { RolesRepository } from 'src/roles/roles.repository';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/auth.interface';

@Injectable()
export class RefreshTokensService {
    constructor(
        private readonly refreshTokensRepository: RefreshTokensRepository,
        private readonly usersRepository: UsersRepository,
        private readonly authService: AuthService,
        private readonly rolesRepository: RolesRepository,
    ) {}

    async getAll() {
        const refreshTokens = await this.refreshTokensRepository.getAll();

        return refreshTokens;
    }

    async delete(id: number) {
        const refreshToken = await this.validateRefreshTokenId(id);

        return {
            message: 'Refresh token deleted successfully',
            refreshToken: refreshToken,
        };
    }

    async refreshToken(refreshTokenDto: { refreshToken: string }) {
        const refreshToken = await this.refreshTokensRepository.getByToken(
            refreshTokenDto.refreshToken,
        );

        if (!refreshToken) {
            throw new NotFoundException('Refresh token not found');
        }

        if (refreshToken.isActive === false) {
            throw new NotFoundException('Refresh token is inactive');
        }

        if (refreshToken.expiresAt < new Date(Date.now())) {
            throw new NotFoundException('Refresh token is expired');
        }

        const user = await this.usersRepository.getUserById(
            refreshToken.userId,
        );

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.refreshTokensRepository.updateExpiresAt(
            refreshToken.id,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ); // Extend expiration by 7 days

        const roleName = await this.rolesRepository.getRoleById(user.roleId);

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

        return {
            message: 'Token refreshed successfully',
            refreshToken: refreshToken.token,
            token: token,
        };
    }

    async validateRefreshTokenId(refreshTokenId: number) {
        const refreshToken =
            await this.refreshTokensRepository.getById(refreshTokenId);

        if (!refreshToken) {
            throw new NotFoundException('Refresh token not found');
        }

        return refreshToken;
    }
}
