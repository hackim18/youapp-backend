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

  async getConversation(
    userAId: string,
    userBId: string,
    options?: { before?: Date; limit?: number },
  ): Promise<MessageDocument[]> {
    const messages = await this.messagesRepository.getConversation(userAId, userBId, options);

    const lastMessage = messages[messages.length - 1];
    await this.messagesRepository.markConversationAsSeen(
      userAId,
      userBId,
      lastMessage?.createdAt,
    );

    return messages.map((msg) =>
      msg.receiverId.toString() === userAId.toString()
        ? { ...msg.toObject?.() ?? msg, seen: true, seenAt: msg.seenAt ?? new Date() }
        : msg,
    ) as unknown as MessageDocument[];
  }
}
