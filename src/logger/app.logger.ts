import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppLogger extends LoggerService {
    constructor() {
        super();
    }

    createTraceId() {
        return uuidv4();
    }
}
