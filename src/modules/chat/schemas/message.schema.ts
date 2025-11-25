import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Message {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  id!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  senderId!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  receiverId!: string;

  @Prop({ required: true, trim: true })
  content!: string;

  @Prop({ default: false })
  seen!: boolean;

  @Prop()
  createdAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
