import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '../schemas/profile.schema';

export class ProfileResponseDto {
  @ApiProperty({ example: 'Profile created successfully' })
  message!: string;

  @ApiProperty({ type: Profile })
  data!: Profile;
}

export class ProfileNullableResponseDto {
  @ApiProperty({ example: 'Profile operation successful' })
  message!: string;

  @ApiProperty({ type: Profile, nullable: true })
  data!: Profile | null;
}
