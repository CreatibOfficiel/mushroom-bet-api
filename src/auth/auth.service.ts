import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../types';
import { LoginDto, RegisterDto } from './dto';

export interface AuthTokens {
  access_token: string;
}

export interface AuthResponse extends AuthTokens {
  user: {
    id: string;
    email: string;
    displayName: string | null;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password } = registerDto;

    // Check if email already exists
    const existingPlayer = await this.prisma.player.findUnique({
      where: { email },
    });

    if (existingPlayer) {
      throw new ConflictException('Email already exists');
    }

    // Hash password with 12 rounds
    const passwordHash = await bcrypt.hash(password, 12);

    // Create player
    const player = await this.prisma.player.create({
      data: {
        email,
        passwordHash,
      },
    });

    // Generate JWT tokens
    const tokens = await this.generateTokens({
      sub: player.id,
      email: player.email,
    });

    return {
      ...tokens,
      user: {
        id: player.id,
        email: player.email,
        displayName: player.displayName,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find player by email
    const player = await this.prisma.player.findUnique({
      where: { email },
    });

    if (!player) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, player.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT tokens
    const tokens = await this.generateTokens({
      sub: player.id,
      email: player.email,
    });

    return {
      ...tokens,
      user: {
        id: player.id,
        email: player.email,
        displayName: player.displayName,
      },
    };
  }

  async refresh(userId: string): Promise<AuthTokens> {
    const player = await this.prisma.player.findUnique({
      where: { id: userId },
    });

    if (!player) {
      throw new UnauthorizedException('Invalid user');
    }

    return this.generateTokens({
      sub: player.id,
      email: player.email,
    });
  }

  private async generateTokens(payload: JwtPayload): Promise<AuthTokens> {
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    return {
      access_token,
    };
  }
}
