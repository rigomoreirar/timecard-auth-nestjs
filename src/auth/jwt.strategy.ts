import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User, JwtPayload } from './auth.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: (req: Request) => {
                // 1) Check if there's a cookie named "access_token"
                if (req.cookies?.access_token) {
                    return req.cookies.access_token as string;
                }

                // 2) Otherwise fall back to Authorization header
                return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
            },
            ignoreExpiration: false,
            secretOrKey: (() => {
                const publicKeyPath = path.resolve(
                    __dirname,
                    '../../keys/public.key',
                );

                if (!fs.existsSync(publicKeyPath)) {
                    throw new NotFoundException(
                        'Private or public key file is missing. Ensure /keys/private.key and /keys/public.key exist.',
                    );
                }

                return fs.readFileSync(publicKeyPath, 'utf-8');
            })(),
            algorithms: ['RS256'],
        });
    }

    validate(payload: JwtPayload): User {
        if (!payload.sub || !payload.role || !payload.clientId) {
            throw new BadRequestException('Invalid JWT payload');
        }

        const user: User = {
            id: payload.sub,
            role: payload.role,
            clientId: payload.clientId,
        };

        return user;
    }
}
