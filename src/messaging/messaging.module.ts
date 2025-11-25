import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import configuration from '../config/configuration';
import { RABBITMQ_CLIENT } from './messaging.constants';
import { MessagingService } from './messaging.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: RABBITMQ_CLIENT,
      inject: [configuration.KEY],
      useFactory: (config: ConfigType<typeof configuration>) =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [config.rabbitmq.url],
            queue: config.rabbitmq.queue,
            queueOptions: { durable: true },
          },
        }),
    },
    MessagingService,
  ],
  exports: [MessagingService, RABBITMQ_CLIENT],
})
export class MessagingModule {}
