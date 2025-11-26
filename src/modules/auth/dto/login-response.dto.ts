import { ApiProperty } from '@nestjs/swagger';

export class LoginDataDto {
  @ApiProperty()
  accessToken!: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'Login successful' })
  message!: string;

  @ApiProperty({ type: LoginDataDto })
  data!: LoginDataDto;
}
