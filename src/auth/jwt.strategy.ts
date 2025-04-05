import { Injectable } from '@nestjs/common';
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
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: (() => {
                const publicKeyPath = path.resolve(
                    __dirname,
                    '../../keys/public.key',
                );

                if (!fs.existsSync(publicKeyPath)) {
                    throw new Error(
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
            throw new Error('Invalid JWT payload');
        }

        const user: User = {
            id: payload.sub,
            role: payload.role,
            clientId: payload.clientId,
        };

        return user;
    }
}
