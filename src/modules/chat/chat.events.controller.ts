import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import type { MessageReceivedEvent } from './events/message-received.event';
import { MessagesRepository } from './messages.repository';

@Controller()
export class ChatEventsController {
  private readonly logger = new Logger(ChatEventsController.name);

  constructor(private readonly messagesRepository: MessagesRepository) {}

  @EventPattern('chat.message.received')
  async handleMessageReceived(
    @Payload() event: MessageReceivedEvent,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      await this.messagesRepository.markDelivered(
        event.messageId,
        event.timestamp,
      );
      this.logger.log(
        `Delivered notification for message ${event.messageId} to receiver ${event.receiverId}`,
      );
    } finally {
      const channel = context.getChannelRef();
      const originalMessage = context.getMessage();
      channel.ack(originalMessage);
    }
  }
}
