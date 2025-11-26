import { Injectable } from '@nestjs/common';
import { MessagingService } from '../../messaging/messaging.service';
import { MessageReceivedEvent } from './events/message-received.event';
import { MessagesRepository } from './messages.repository';
import { MessageDocument } from './schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly messagingService: MessagingService,
  ) {}

  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string,
  ): Promise<MessageDocument> {
    const message = await this.messagesRepository.sendMessage(
      senderId,
      receiverId,
      content,
    );

    const event: MessageReceivedEvent = {
      messageId: message.id,
      senderId,
      receiverId,
      timestamp: message.createdAt ?? new Date(),
      content,
    };

    this.messagingService.emit('chat.message.received', event);

    return message;
  }

  getConversation(userAId: string, userBId: string): Promise<MessageDocument[]> {
    return this.messagesRepository.getConversation(userAId, userBId);
  }
}
