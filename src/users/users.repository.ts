import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async getAll() {
        try {
            return await this.databaseService.user.findMany({
                where: { isDeleted: false },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to get all users',
                });
            }

            throw error;
        }
    }

    async getUsersByRoleId(roleId: number) {
        try {
            return await this.databaseService.user.findMany({
                where: { roleId, isDeleted: false },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to get users by roleId',
                });
            }

            throw error;
        }
    }

    async getUserByClientId(clientId: string) {
        try {
            return await this.databaseService.user.findFirst({
                where: { clientId, isDeleted: false },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to get user by clientId',
                });
            }
            throw error;
        }
    }

    async getUserById(id: number) {
        try {
            return await this.databaseService.user.findFirst({
                where: { id, isDeleted: false },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to get user by ID',
                });
            }
            throw error;
        }
    }

    async save(userCreateInput: Prisma.UserCreateInput) {
        try {
            return await this.databaseService.user.create({
                data: userCreateInput,
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to register user',
                });
            }
            throw error;
        }
    }

    async update(clientId: string, userUpdateInput: Prisma.UserUpdateInput) {
        try {
            return await this.databaseService.user.update({
                where: { clientId: clientId, isDeleted: false },
                data: userUpdateInput,
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to update user',
                });
            }
            throw error;
        }
    }

    async delete(clientId: string) {
        try {
            return await this.databaseService.user.update({
                where: { clientId: clientId, isDeleted: false },
                data: { isDeleted: true },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to delete user',
                });
            }
            throw error;
        }
    }
}
