import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RefreshTokensRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async getAll() {
        try {
            return await this.databaseService.refreshToken.findMany({
                where: { isActive: true },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to get all refresh tokens',
                });
            }

            throw error;
        }
    }

    async getById(id: number) {
        try {
            return await this.databaseService.refreshToken.findUnique({
                where: { id },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to get refresh token by ID',
                });
            }

            throw error;
        }
    }

    async save(refreshTokenCreateInput: Prisma.RefreshTokenCreateInput) {
        try {
            return await this.databaseService.refreshToken.create({
                data: refreshTokenCreateInput,
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to save refresh token',
                });
            }

            throw error;
        }
    }

    async delete(id: number) {
        try {
            return await this.databaseService.refreshToken.update({
                where: { id },
                data: { isActive: false },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to delete refresh token',
                });
            }

            throw error;
        }
    }

    async getByUserId(userId: number) {
        try {
            return await this.databaseService.refreshToken.findMany({
                where: { userId, isActive: true },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to get refresh token by user ID',
                });
            }

            throw error;
        }
    }
}
