import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './schemas/profile.schema';

@ApiTags('Profiles')
@ApiBearerAuth()
@Controller('api')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createProfile')
  @ApiBody({ type: CreateProfileDto })
  @ApiOkResponse({ type: Profile, description: 'Created profile' })
  createProfile(
    @GetUser('sub') userId: string,
    @Body() payload: CreateProfileDto,
  ): Promise<Profile> {
    return this.profilesService.create({
      ...payload,
      userId,
      interests: payload.interests ?? [],
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('getProfile')
  @ApiOkResponse({
    type: Profile,
    description: 'Profile for current user',
    isArray: false,
  })
  getProfile(@GetUser('sub') userId: string): Promise<Profile | null> {
    return this.profilesService.findByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('updateProfile')
  @ApiBody({ type: UpdateProfileDto })
  @ApiOkResponse({ type: Profile, description: 'Updated profile' })
  updateProfile(
    @GetUser('sub') userId: string,
    @Body() payload: UpdateProfileDto,
  ): Promise<Profile | null> {
    return this.profilesService.update(userId, {
      ...payload,
    });
  }
}
