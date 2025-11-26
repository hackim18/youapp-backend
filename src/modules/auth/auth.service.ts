import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/schemas/user.schema';
import { RegisterResponseDto } from './dto/register-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { LoginDataDto, LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getUserId(user: User): string {
    return (
      (user as User & { id?: string }).id ??
      (
        user as User & { _id?: { toString?: () => string } }
      )._id?.toString?.() ??
      ''
    );
  }

  async register(_payload: RegisterDto): Promise<RegisterResponseDto> {
    const normalizedEmail = _payload.email.toLowerCase();

    const [existingEmail, existingUsername] = await Promise.all([
      this.usersService.findByEmail(normalizedEmail),
      this.usersService.findByUsername(_payload.username),
    ]);

    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    const createdUser = await this.usersService.createUser({
      ..._payload,
      email: normalizedEmail,
    });

    return {
      message: 'User registered successfully',
      data: {
        id: this.getUserId(createdUser),
        email: createdUser.email,
        username: createdUser.username,
      },
    };
  }

  async login(_payload: LoginDto): Promise<LoginResponseDto> {
    const identifier = _payload.emailOrUsername.trim();
    const emailCandidate = identifier.includes('@')
      ? identifier.toLowerCase()
      : identifier;

    const user =
      (await this.usersService.findByEmail(emailCandidate)) ??
      (await this.usersService.findByUsername(identifier));

    if (!user || user.password !== _payload.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: this.getUserId(user),
      email: user.email,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(payload);
    const data: LoginDataDto = { accessToken };

    return {
      message: 'Login successful',
      data,
    };
  }

  async validateUser(
    _identifier: string,
    _password: string,
  ): Promise<User | null> {
    return null;
  }
}
