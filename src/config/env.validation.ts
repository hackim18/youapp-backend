import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  MONGODB_URI: Joi.string()
    .uri({ scheme: ['mongodb', 'mongodb+srv'] })
    .default('mongodb://localhost:27017/youapp'),
  JWT_SECRET: Joi.string().min(16).default('change-me'),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  RABBITMQ_URL: Joi.string()
    .uri({ scheme: ['amqp', 'amqps'] })
    .default('amqp://localhost:5672'),
  RABBITMQ_QUEUE: Joi.string().default('youapp.messages'),
});
