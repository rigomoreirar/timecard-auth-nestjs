import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { User } from '../auth.interface';
import { Request } from 'express';

@Injectable()
export class AdminRoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const userAuthPayload: Request = context.switchToHttp().getRequest();

        const user: User = userAuthPayload.user as User;

        if (!user) {
            throw new ForbiddenException('No user in request');
        }
        if (user.role !== 'admin') {
            throw new ForbiddenException('Admin role required');
        }

        return true;
    }
}
