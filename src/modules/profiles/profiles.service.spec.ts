import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { ProfilesRepository } from './profiles.repository';
import { Gender } from './schemas/profile.schema';

const sampleDate = new Date('2020-08-15T00:00:00Z'); // Leo, Rat

describe('ProfilesService', () => {
  let service: ProfilesService;
  const repoMock = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    update: jest.fn(),
  } as unknown as ProfilesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfilesService, { provide: ProfilesRepository, useValue: repoMock }],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    jest.clearAllMocks();
  });

  it('creates profile with computed horoscope and zodiac', async () => {
    repoMock.create = jest.fn().mockImplementation((data) => Promise.resolve(data as any));

    const result = await service.create({
      userId: 'user-1',
      displayName: 'Alice',
      gender: Gender.Female,
      birthday: sampleDate,
      horoscope: undefined,
      zodiac: undefined,
      interests: [],
      imageUrl: undefined,
    });

    expect(repoMock.create).toHaveBeenCalled();
    expect(result.horoscope).toBe('Leo');
    expect(result.zodiac).toBe('Rat');
  });

  it('updates profile and recomputes if birthday provided', async () => {
    repoMock.update = jest.fn().mockImplementation((_id, data) => Promise.resolve(data as any));

    const updated = await service.update('user-1', { birthday: sampleDate });

    expect(repoMock.update).toHaveBeenCalledWith('user-1', expect.objectContaining({
      horoscope: 'Leo',
      zodiac: 'Rat',
    }));
    expect(updated?.horoscope).toBe('Leo');
    expect(updated?.zodiac).toBe('Rat');
  });
});
