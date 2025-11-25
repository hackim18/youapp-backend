import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MessagesRepository } from './messages.repository';
import { Message, MessageSchema } from './schemas/message.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])],
  controllers: [ChatController],
  providers: [ChatService, MessagesRepository],
  exports: [ChatService, MessagesRepository],
})
export class ChatModule {}
