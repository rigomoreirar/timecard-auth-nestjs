import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { JwtResponse } from '../../auth/auth.interface';
import { Request } from 'express';

@Injectable()
export class AdminRoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const AuthTokenContent: Request = context.switchToHttp().getRequest();

        const user: JwtResponse = AuthTokenContent.user as JwtResponse;

        if (!user) {
            throw new ForbiddenException('No user in request');
        }
        if (user.role !== 'admin') {
            throw new ForbiddenException('Admin role required');
        }

        return true;
    }
}
