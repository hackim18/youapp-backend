import { Injectable } from '@nestjs/common';
import { CreateProfileInput, ProfilesRepository, UpdateProfileInput } from './profiles.repository';
import { Profile } from './schemas/profile.schema';
import { calculateHoroscope, calculateZodiac } from './utils/zodiac-calculator';

@Injectable()
export class ProfilesService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  create(data: CreateProfileInput): Promise<Profile> {
    const horoscope = data.birthday ? calculateHoroscope(data.birthday) : data.horoscope;
    const zodiac = data.birthday ? calculateZodiac(data.birthday) : data.zodiac;
    return this.profilesRepository.create({ ...data, horoscope, zodiac });
  }

  findByUserId(userId: string): Promise<Profile | null> {
    return this.profilesRepository.findByUserId(userId);
  }

  update(userId: string, data: UpdateProfileInput): Promise<Profile | null> {
    const horoscope = data.birthday ? calculateHoroscope(data.birthday) : data.horoscope;
    const zodiac = data.birthday ? calculateZodiac(data.birthday) : data.zodiac;
    return this.profilesRepository.update(userId, { ...data, horoscope, zodiac });
  }
}
