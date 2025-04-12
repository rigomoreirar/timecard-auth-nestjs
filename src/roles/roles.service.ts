import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesRepository } from '../repositories/roles.repository';
import { UsersRepository } from 'src/repositories/users.repository';
import { ValidationService } from 'src/validation/validation.service';

@Injectable()
export class RolesService {
    constructor(
        private readonly rolesRepository: RolesRepository,
        private readonly usersRepository: UsersRepository,
        private readonly validationService: ValidationService,
    ) {}

    async save(createRoleDto: CreateRoleDto) {
        const roleExists = await this.rolesRepository.getRoleByName(
            createRoleDto.name,
        );

        if (roleExists) {
            throw new NotFoundException({
                message: 'Role already exists',
            });
        }

        const role: Prisma.RoleCreateInput = {
            ...createRoleDto,
        };

        await this.rolesRepository.save(role);

        return {
            message: 'Role created successfully',
            role: role,
        };
    }

    async getAll() {
        const roles = await this.rolesRepository.getAll();

        return roles;
    }

    async getRoleById(roleId: number) {
        const role = await this.validationService.validateRoleId(roleId);

        return role;
    }

    async update(roleId: number, updateRoleDto: UpdateRoleDto) {
        await this.validationService.validateRoleId(roleId);

        const updatedRole: Prisma.RoleUpdateInput = {
            ...updateRoleDto,
        };

        await this.rolesRepository.update(roleId, updatedRole);

        return {
            message: 'Role updated successfully',
            role: updatedRole,
        };
    }

    async delete(roleId: number) {
        await this.validationService.validateRoleId(roleId);

        await this.rolesRepository.delete(roleId);

        return {
            message: 'Role deleted successfully',
        };
    }

    async getUsersByRoleName(roleName: string) {
        const role = await this.validationService.validateRoleName(roleName);

        const users = await this.usersRepository.getUsersByRoleId(role.id);

        return users;
    }
}
