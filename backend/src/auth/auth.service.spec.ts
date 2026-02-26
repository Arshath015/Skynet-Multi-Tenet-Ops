import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockJwt = {
    sign: jest.fn().mockReturnValue('mocked-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate correct password', async () => {
    const hashed = await bcrypt.hash('123456', 10);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      passwordHash: hashed,
      role: 'STUDENT',
      approved: true,
    });

    const result = await service.validateUser('test@test.com', '123456');
    expect(result).toBeDefined();
  });
});