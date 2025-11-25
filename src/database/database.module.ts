import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [configuration.KEY],
      useFactory: (config: ConfigType<typeof configuration>) => ({
        uri: config.mongo.uri,
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
