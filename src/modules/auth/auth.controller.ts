import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@ApiTags('Auth')
@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ type: RegisterResponseDto, description: 'Registered user' })
  register(@Body() payload: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(payload);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto, description: 'JWT access token' })
  login(@Body() payload: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(payload);
  }
}
