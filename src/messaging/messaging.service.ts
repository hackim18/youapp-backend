import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RABBITMQ_CLIENT } from './messaging.constants';

@Injectable()
export class MessagingService {
  constructor(
    @Inject(RABBITMQ_CLIENT)
    private readonly client: ClientProxy,
  ) {}

  emit(pattern: string, payload: unknown) {
    return this.client.emit(pattern, payload);
  }
}
