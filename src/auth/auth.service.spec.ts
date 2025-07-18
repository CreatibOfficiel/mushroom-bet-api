import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: {
    player: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const prismaServiceMock = {
      player: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const jwtServiceMock = {
      signAsync: jest.fn(),
    };

    const configServiceMock = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const mockRegisterDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123';
      const mockPlayer = {
        id: 'player-id-123',
        email: mockRegisterDto.email,
        passwordHash: hashedPassword,
        displayName: null,
      };
      const mockToken = 'jwt-token-123';

      prismaService.player.findUnique.mockResolvedValue(null); // No existing user
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      prismaService.player.create.mockResolvedValue(mockPlayer);
      jwtService.signAsync.mockResolvedValue(mockToken);

      // Act
      const result = await service.register(mockRegisterDto);

      // Assert
      expect(prismaService.player.findUnique).toHaveBeenCalledWith({
        where: { email: mockRegisterDto.email },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(mockRegisterDto.password, 12);
      expect(prismaService.player.create).toHaveBeenCalledWith({
        data: {
          email: mockRegisterDto.email,
          passwordHash: hashedPassword,
        },
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: mockPlayer.id,
          email: mockPlayer.email,
        },
        { expiresIn: '15m' },
      );
      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: mockPlayer.id,
          email: mockPlayer.email,
          displayName: mockPlayer.displayName,
        },
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      const existingPlayer = {
        id: 'existing-player-id',
        email: mockRegisterDto.email,
        passwordHash: 'existingHash',
        displayName: null,
      };

      prismaService.player.findUnique.mockResolvedValue(existingPlayer);

      // Act & Assert
      await expect(service.register(mockRegisterDto)).rejects.toThrow(ConflictException);
      await expect(service.register(mockRegisterDto)).rejects.toThrow('Email already exists');

      expect(prismaService.player.findUnique).toHaveBeenCalledWith({
        where: { email: mockRegisterDto.email },
      });
      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      expect(prismaService.player.create).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
