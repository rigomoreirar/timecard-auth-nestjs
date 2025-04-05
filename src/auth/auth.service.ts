import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './auth.interface';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    signAccessToken(user: User): string {
        const payload = {
            sub: user.id,
            role: user.role,
            clientId: user.clientId,
        };

        return this.jwtService.sign(payload);
    }
}
