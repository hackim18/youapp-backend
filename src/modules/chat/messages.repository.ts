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

  sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    return this.messageModel.create({ senderId, receiverId, content });
  }

  getConversation(userAId: string, userBId: string): Promise<Message[]> {
    const filter: FilterQuery<Message> = {
      $or: [
        { senderId: userAId, receiverId: userBId },
        { senderId: userBId, receiverId: userAId },
      ],
    };

    return this.messageModel.find(filter).sort({ createdAt: 1 }).exec();
  }
}
