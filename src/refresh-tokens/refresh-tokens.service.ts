import { Injectable } from '@nestjs/common';
import { RefreshTokensRepository } from './refresh-tokens.repository';

@Injectable()
export class RefreshTokensService {
    constructor(
        private readonly refreshTokensRepository: RefreshTokensRepository,
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

    async validateRefreshTokenId(refreshTokenId: number) {
        const refreshToken =
            await this.refreshTokensRepository.getById(refreshTokenId);

        if (!refreshToken) {
            throw new Error('Refresh token not found');
        }

        return refreshToken;
    }
}
