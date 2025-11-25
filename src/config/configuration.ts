import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  mongo: {
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/youapp',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'supersecretkey',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL ?? 'amqp://localhost:5672',
    queue: process.env.RABBITMQ_QUEUE ?? 'youapp.messages',
  },
}));
