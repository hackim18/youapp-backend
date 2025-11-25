import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/schemas/user.schema';

describe('AuthService', () => {
  let service: AuthService;
  const usersServiceMock = {
    createUser: jest.fn(),
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
  });

  it('register should create a user', async () => {
    const dto: RegisterDto = { email: 'a@example.com', username: 'user', password: 'pass123' };
    const user = { id: '1', ...dto } as unknown as User;
    usersServiceMock.createUser = jest.fn().mockResolvedValue(user);

    const result = await service.register(dto);

    expect(usersServiceMock.createUser).toHaveBeenCalledWith(dto);
    expect(result).toEqual(user);
  });

  it('login should return access token', async () => {
    const dto: LoginDto = { emailOrUsername: 'user', password: 'pass123' };
    jwtServiceMock.sign = jest.fn().mockReturnValue('token');

    const result = await service.login(dto);

    expect(jwtServiceMock.sign).toHaveBeenCalled();
    expect(result).toEqual({ accessToken: 'token' });
  });
});
