import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';

export type CreateProfileInput = Omit<Profile, 'createdAt' | 'updatedAt'>;
export type UpdateProfileInput = Partial<CreateProfileInput>;

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  create(data: CreateProfileInput): Promise<Profile> {
    return this.profileModel.create(data);
  }

  findByUserId(userId: string): Promise<Profile | null> {
    return this.profileModel.findOne({ userId }).exec();
  }

  update(userId: string, data: UpdateProfileInput): Promise<Profile | null> {
    return this.profileModel
      .findOneAndUpdate({ userId }, { $set: data }, { new: true, upsert: false })
      .exec();
  }
}
