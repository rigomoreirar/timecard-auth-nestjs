import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './auth.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
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
                    throw new NotFoundException(
                        'Private or public key file is missing. Ensure /keys/private.key and /keys/public.key exist.',
                    );
                }

                return fs.readFileSync(publicKeyPath, 'utf-8');
            })(),
            algorithms: ['RS256'],
        });
    }

    validate(payload: JwtPayload): JwtPayload {
        if (!payload.userId || !payload.role || !payload.clientId) {
            throw new BadRequestException('Invalid JWT payload');
        }

        return payload;
    }
}
