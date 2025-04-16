import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getMicroserviceName(): string {
        return 'auth-microservice 1.0v';
    }
}
