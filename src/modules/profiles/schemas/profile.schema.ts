import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
    unique: true,
  })
  userId!: string;

  @Prop({ required: true, trim: true })
  displayName!: string;

  @Prop({ required: true, enum: Gender })
  gender!: Gender;

  @Prop({ type: Date })
  birthday?: Date;

  @Prop()
  horoscope?: string;

  @Prop()
  zodiac?: string;

  @Prop()
  height?: number;

  @Prop()
  weight?: number;

  @Prop({ type: [String], default: [] })
  interests!: string[];

  @Prop()
  imageUrl?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
