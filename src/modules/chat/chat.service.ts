import { Injectable } from '@nestjs/common';
import { Message } from './schemas/message.schema';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class ChatService {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    return this.messagesRepository.sendMessage(senderId, receiverId, content);
  }

  getConversation(userAId: string, userBId: string): Promise<Message[]> {
    return this.messagesRepository.getConversation(userAId, userBId);
  }
}
