import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), AdminRoleGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Post()
    save(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.save(createRoleDto);
    }

    @Get()
    findAll() {
        return this.rolesService.getAll();
    }

    @Get(':id')
    getRoleById(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.getRoleById(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateRoleDto: UpdateRoleDto,
    ) {
        return this.rolesService.update(id, updateRoleDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.delete(id);
    }

    @Get('/:roleName/users')
    getUsersByRoleName(@Param('roleName') roleName: string) {
        return this.rolesService.getUsersByRoleName(roleName);
    }
}
