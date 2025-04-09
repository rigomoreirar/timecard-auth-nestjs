import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.interface';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    signAccessToken(user: JwtPayload): string {
        let expiresIn = '3m';

        if (user.role === 'api') {
            expiresIn = '12h';
        } else if (user.role === 'webapp') {
            expiresIn = '5m';
        }

        return this.jwtService.sign(user, {
            algorithm: 'RS256',
            expiresIn,
        });
    }
}
