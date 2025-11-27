import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
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
import { ProfileNullableResponseDto, ProfileResponseDto } from './dto/profile-response.dto';

@ApiTags('Profiles')
@ApiBearerAuth()
@Controller('api')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createProfile')
  @ApiBody({
    type: CreateProfileDto,
    examples: {
      default: {
        summary: 'Create profile with full data',
        value: {
          displayName: 'Jane Doe',
          gender: 'Female',
          birthday: '1995-06-15',
          height: 170,
          weight: 60,
          interests: ['music', 'travel'],
          imageUrl: 'https://example.com/avatar.jpg',
        },
      },
    },
  })
  @ApiOkResponse({ type: ProfileResponseDto, description: 'Created profile' })
  async createProfile(
    @GetUser('sub') userId: string,
    @Body() payload: CreateProfileDto,
  ): Promise<ProfileResponseDto> {
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const profile = await this.profilesService.create({
      ...payload,
      userId,
      interests: payload.interests ?? [],
    });

    return {
      message: 'Profile created successfully',
      data: profile,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('getProfile')
  @ApiOkResponse({
    type: ProfileNullableResponseDto,
    description: 'Profile for current user',
    isArray: false,
  })
  async getProfile(
    @GetUser('sub') userId: string,
  ): Promise<ProfileNullableResponseDto> {
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const profile = await this.profilesService.findByUserId(userId);

    return {
      message: 'Profile retrieved successfully',
      data: profile,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('updateProfile')
  @ApiBody({
    type: UpdateProfileDto,
    examples: {
      default: {
        summary: 'Update partial profile',
        value: {
          displayName: 'Jane D',
          zodiac: 'Gemini',
          interests: ['music', 'travel', 'reading'],
        },
      },
    },
  })
  @ApiOkResponse({
    type: ProfileNullableResponseDto,
    description: 'Updated profile',
  })
  async updateProfile(
    @GetUser('sub') userId: string,
    @Body() payload: UpdateProfileDto,
  ): Promise<ProfileNullableResponseDto> {
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const profile = await this.profilesService.update(userId, {
      ...payload,
    });

    return {
      message: 'Profile updated successfully',
      data: profile,
    };
  }
}
