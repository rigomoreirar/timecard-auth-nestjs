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

        let expiresIn = '15m';

        if (user.role === 'api') {
            expiresIn = '24h';
        } else if (user.role === 'webapp') {
            expiresIn = '8h';
        }

        return this.jwtService.sign(payload, {
            algorithm: 'RS256',
            expiresIn,
        });
    }
}
