import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessagesRepository {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string,
  ): Promise<MessageDocument> {
    return this.messageModel.create({
      senderId,
      receiverId,
      content,
      deliveredAt: new Date(),
      seen: false,
    });
  }

  async getConversation(
    userAId: string,
    userBId: string,
    options?: { before?: Date; limit?: number },
  ): Promise<MessageDocument[]> {
    const filter: FilterQuery<Message> = {
      $or: [
        { senderId: userAId, receiverId: userBId },
        { senderId: userBId, receiverId: userAId },
      ],
    };

    if (options?.before) {
      filter.createdAt = { $lt: options.before };
    }

    const limit = options?.limit && options.limit > 0 ? Math.min(options.limit, 100) : 50;

    const messages = await this.messageModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    return messages.reverse();
  }

  async markConversationAsSeen(
    currentUserId: string,
    otherUserId: string,
    upTo?: Date,
  ): Promise<void> {
    const filter: FilterQuery<Message> = {
      receiverId: currentUserId,
      senderId: otherUserId,
      seen: false,
    };

    if (upTo) {
      filter.createdAt = { $lte: upTo };
    }

    await this.messageModel
      .updateMany(filter, { $set: { seen: true, seenAt: new Date() } })
      .exec();
  }
}
