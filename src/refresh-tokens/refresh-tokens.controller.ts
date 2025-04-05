import { Controller, Get, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { RefreshTokensService } from './refresh-tokens.service';

@Controller('refresh-tokens')
export class RefreshTokensController {
    constructor(private readonly refreshTokensService: RefreshTokensService) {}

    @Get()
    getAll() {
        return this.refreshTokensService.getAll();
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.refreshTokensService.delete(id);
    }
}
