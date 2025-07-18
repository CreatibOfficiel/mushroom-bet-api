import { Skin as PrismaSkin, Player as PrismaPlayer } from '@prisma/client';

// Re-export Prisma types to avoid conflicts
export type Skin = PrismaSkin;
export type Character = PrismaSkin['character'];

// Player interface for API responses (without sensitive data)
export interface Player {
  id: string;
  email: string;
  displayName: string | null;
  skin: Skin | null;
}

// Authenticated user type (matching what JWT strategy returns)
export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  skin: Skin | null;
}

// Type for Prisma Player with Skin relation
export type PlayerWithSkin = PrismaPlayer & {
  skin: Skin | null;
};

// Express Request with typed user
export interface AuthenticatedRequest {
  user: AuthUser;
}

// Cookie types for Express
export interface RequestCookies {
  access_token?: string;
}

// JWT Payload
export interface JwtPayload {
  sub: string;
  email: string;
} 