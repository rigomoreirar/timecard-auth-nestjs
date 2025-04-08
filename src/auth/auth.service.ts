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

        let expiresIn = '3m';

        if (user.role === 'api') {
            expiresIn = '12h';
        } else if (user.role === 'webapp') {
            expiresIn = '5m';
        }

        return this.jwtService.sign(payload, {
            algorithm: 'RS256',
            expiresIn,
        });
    }
}
