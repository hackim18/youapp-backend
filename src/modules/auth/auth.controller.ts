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
  @ApiBody({
    type: RegisterDto,
    examples: {
      default: {
        summary: 'Register with email/username/password',
        value: {
          email: 'user1@example.com',
          username: 'user1',
          password: 'P@ssw0rd',
        },
      },
    },
  })
  @ApiOkResponse({ type: RegisterResponseDto, description: 'Registered user' })
  register(@Body() payload: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(payload);
  }

  @Post('login')
  @ApiBody({
    type: LoginDto,
    examples: {
      withEmail: {
        summary: 'Login using email',
        value: { emailOrUsername: 'user1@example.com', password: 'P@ssw0rd' },
      },
      withUsername: {
        summary: 'Login using username',
        value: { emailOrUsername: 'user1', password: 'P@ssw0rd' },
      },
    },
  })
  @ApiOkResponse({ type: LoginResponseDto, description: 'JWT access token' })
  login(@Body() payload: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(payload);
  }
}
