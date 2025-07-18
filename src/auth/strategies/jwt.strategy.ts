import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUser, JwtPayload, PlayerWithSkin, RequestCookies } from '../../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookies = request.cookies as RequestCookies;
          return cookies?.access_token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser | null> {
    const player = (await this.prisma.player.findUnique({
      where: { id: payload.sub },
      include: { skin: true },
    })) as PlayerWithSkin | null;

    if (!player) {
      return null;
    }

    return {
      id: player.id,
      email: player.email,
      displayName: player.displayName,
      skin: player.skin,
    };
  }
}
