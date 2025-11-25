import { Injectable } from '@nestjs/common';
import { CreateProfileInput, ProfilesRepository, UpdateProfileInput } from './profiles.repository';
import { Profile } from './schemas/profile.schema';

@Injectable()
export class ProfilesService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  create(data: CreateProfileInput): Promise<Profile> {
    return this.profilesRepository.create(data);
  }

  findByUserId(userId: string): Promise<Profile | null> {
    return this.profilesRepository.findByUserId(userId);
  }

  update(userId: string, data: UpdateProfileInput): Promise<Profile | null> {
    return this.profilesRepository.update(userId, data);
  }
}
