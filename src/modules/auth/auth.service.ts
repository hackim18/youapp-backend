import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/schemas/user.schema';
import { RegisterResponseDto } from './dto/register-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(_payload: RegisterDto): Promise<RegisterResponseDto> {
    const [existingEmail, existingUsername] = await Promise.all([
      this.usersService.findByEmail(_payload.email),
      this.usersService.findByUsername(_payload.username),
    ]);

    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    const createdUser = await this.usersService.createUser(_payload);

    return {
      message: 'User registered successfully',
      data: {
        id:
          (createdUser as User & { id?: string }).id ??
          (
            createdUser as User & { _id?: { toString?: () => string } }
          )._id?.toString?.() ??
          '',
        email: createdUser.email,
        username: createdUser.username,
      },
    };
  }

  async login(_payload: LoginDto): Promise<{ accessToken: string }> {
    const accessToken = this.jwtService.sign({});
    return { accessToken };
  }

  async validateUser(
    _identifier: string,
    _password: string,
  ): Promise<User | null> {
    return null;
  }
}
