import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RolesRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async getAll() {
        try {
            return await this.databaseService.role.findMany({
                where: { isDeleted: false },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to get all roles',
                });
            }
            throw error;
        }
    }

    async getRoleById(roleId: number) {
        try {
            return await this.databaseService.role.findFirst({
                where: { id: roleId, isDeleted: false },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to get role by id',
                });
            }
            throw error;
        }
    }

    async save(roleCreateInput: Prisma.RoleCreateInput) {
        try {
            return await this.databaseService.role.create({
                data: roleCreateInput,
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to save role',
                });
            }
            throw error;
        }
    }

    async update(roleId: number, roleUpdateInput: Prisma.RoleUpdateInput) {
        try {
            return await this.databaseService.role.update({
                where: { id: roleId, isDeleted: false },
                data: roleUpdateInput,
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to update role',
                });
            }
            throw error;
        }
    }

    async delete(roleId: number) {
        try {
            return await this.databaseService.user.update({
                where: { id: roleId, isDeleted: false },
                data: { isDeleted: true },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to delete role',
                });
            }
            throw error;
        }
    }

    async getRoleByName(roleName: string) {
        try {
            return await this.databaseService.role.findFirst({
                where: { name: roleName, isDeleted: false },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException({
                    message: 'Failed to get role by id',
                });
            }
            throw error;
        }
    }
}
