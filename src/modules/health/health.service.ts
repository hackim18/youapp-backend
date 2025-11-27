import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getLiveness() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  getReadiness() {
    const mongoReady = this.connection.readyState === 1;
    return {
      status: mongoReady ? 'ok' : 'degraded',
      mongo: mongoReady ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}
