import { Module, NotFoundException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';
import * as path from 'path';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const privateKeyPath = path.resolve(
                    __dirname,
                    '../../keys/private.key',
                );
                const publicKeyPath = path.resolve(
                    __dirname,
                    '../../keys/public.key',
                );

                if (
                    !fs.existsSync(privateKeyPath) ||
                    !fs.existsSync(publicKeyPath)
                ) {
                    throw new NotFoundException(
                        'Private or public key file is missing. Ensure /keys/private.key and /keys/public.key exist.',
                    );
                }

                const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
                const publicKey = fs.readFileSync(publicKeyPath, 'utf-8');

                return {
                    privateKey,
                    publicKey,
                    signOptions: {
                        algorithm: 'RS256',
                        expiresIn:
                            configService.get<string>('JWT_EXPIRES_IN') ||
                            '10m',
                    },
                };
            },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
