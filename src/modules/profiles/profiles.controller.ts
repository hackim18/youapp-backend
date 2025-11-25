import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { calculateHoroscope, calculateZodiac } from './utils/zodiac-calculator';
import { Profile } from './schemas/profile.schema';

@Controller('api')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createProfile')
  createProfile(
    @GetUser('sub') userId: string,
    @Body() payload: CreateProfileDto,
  ): Promise<Profile> {
    const horoscope = payload.birthday
      ? calculateHoroscope(payload.birthday)
      : undefined;
    const zodiac = payload.birthday
      ? calculateZodiac(payload.birthday)
      : undefined;

    return this.profilesService.create({
      ...payload,
      userId,
      horoscope,
      zodiac,
      interests: payload.interests ?? [],
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('getProfile')
  getProfile(@GetUser('sub') userId: string): Promise<Profile | null> {
    return this.profilesService.findByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('updateProfile')
  async updateProfile(
    @GetUser('sub') userId: string,
    @Body() payload: UpdateProfileDto,
  ): Promise<Profile | null> {
    let horoscope = payload.horoscope;
    let zodiac = payload.zodiac;

    if (payload.birthday) {
      horoscope = calculateHoroscope(payload.birthday);
      zodiac = calculateZodiac(payload.birthday);
    }

    return this.profilesService.update(userId, {
      ...payload,
      horoscope,
      zodiac,
    });
  }
}
