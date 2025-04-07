import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';
import { RefreshTokensService } from './refresh-tokens.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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

    @Post('')
    refreshToken(@Body('') refreshTokenDto: RefreshTokenDto) {
        return this.refreshTokensService.refreshToken(refreshTokenDto);
    }
}
