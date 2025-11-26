import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  const usersServiceMock = {
    createUser: jest.fn(),
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
  } as unknown as UsersService;

  const jwtServiceMock = {
    sign: jest.fn(),
  } as unknown as JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
    usersServiceMock.createUser = jest.fn();
    usersServiceMock.findByEmail = jest.fn();
    usersServiceMock.findByUsername = jest.fn();
    jwtServiceMock.sign = jest.fn();
  });

  it('register should create a user and return response payload', async () => {
    const dto: RegisterDto = { email: 'a@example.com', username: 'user', password: 'pass123' };
    const user = { id: '1', ...dto } as unknown as User;
    usersServiceMock.findByEmail = jest.fn().mockResolvedValue(null);
    usersServiceMock.findByUsername = jest.fn().mockResolvedValue(null);
    usersServiceMock.createUser = jest.fn().mockResolvedValue(user);

    const result = await service.register(dto);

    expect(usersServiceMock.createUser).toHaveBeenCalledWith({
      ...dto,
      email: dto.email.toLowerCase(),
    });
    const expected: RegisterResponseDto = {
      message: 'User registered successfully',
      data: { id: '1', email: dto.email.toLowerCase(), username: dto.username },
    };
    expect(result).toEqual(expected);
  });

  it('register should throw conflict when email already exists', async () => {
    const dto: RegisterDto = { email: 'a@example.com', username: 'user', password: 'pass123' };
    usersServiceMock.findByEmail = jest.fn().mockResolvedValue({} as User);
    usersServiceMock.findByUsername = jest.fn().mockResolvedValue(null);

    await expect(service.register(dto)).rejects.toBeInstanceOf(ConflictException);
    expect(usersServiceMock.createUser).not.toHaveBeenCalled();
  });

  it('register should throw conflict when username already exists', async () => {
    const dto: RegisterDto = { email: 'a@example.com', username: 'user', password: 'pass123' };
    usersServiceMock.findByEmail = jest.fn().mockResolvedValue(null);
    usersServiceMock.findByUsername = jest.fn().mockResolvedValue({} as User);

    await expect(service.register(dto)).rejects.toBeInstanceOf(ConflictException);
    expect(usersServiceMock.createUser).not.toHaveBeenCalled();
  });

  it('login should return access token with payload', async () => {
    const dto: LoginDto = { emailOrUsername: 'user', password: 'pass123' };
    const user = { id: '1', email: 'a@example.com', username: 'user', password: 'pass123' } as User;
    usersServiceMock.findByEmail = jest.fn().mockResolvedValue(null);
    usersServiceMock.findByUsername = jest.fn().mockResolvedValue(user);
    jwtServiceMock.sign = jest.fn().mockReturnValue('token');

    const result = await service.login(dto);

    expect(usersServiceMock.findByUsername).toHaveBeenCalledWith(dto.emailOrUsername);
    expect(jwtServiceMock.sign).toHaveBeenCalledWith({
      sub: '1',
      email: user.email,
      username: user.username,
    });
    expect(result).toEqual({
      message: 'Login successful',
      data: { accessToken: 'token' },
    });
  });

  it('login should throw unauthorized when user not found', async () => {
    const dto: LoginDto = { emailOrUsername: 'missing', password: 'pass123' };
    usersServiceMock.findByEmail = jest.fn().mockResolvedValue(null);
    usersServiceMock.findByUsername = jest.fn().mockResolvedValue(null);

    await expect(service.login(dto)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtServiceMock.sign).not.toHaveBeenCalled();
  });

  it('login should throw unauthorized when password mismatches', async () => {
    const dto: LoginDto = { emailOrUsername: 'user', password: 'wrong' };
    const user = { id: '1', email: 'a@example.com', username: 'user', password: 'pass123' } as User;
    usersServiceMock.findByEmail = jest.fn().mockResolvedValue(null);
    usersServiceMock.findByUsername = jest.fn().mockResolvedValue(user);

    await expect(service.login(dto)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtServiceMock.sign).not.toHaveBeenCalled();
  });
});
