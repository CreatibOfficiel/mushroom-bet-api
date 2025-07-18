import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configure app like in main.ts
    app.enableCors({
      origin: process.env.FRONT_ORIGIN || 'http://localhost:3000',
      credentials: true,
    });
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Clean up database before each test
    await prisma.player.deleteMany();
  });

  afterAll(async () => {
    await prisma.player.deleteMany();
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user and set cookie', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'Registration successful',
        user: {
          email: registerDto.email,
          displayName: null,
        },
      });

      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('access_token=');
    });

    it('should return 409 when email already exists', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Register first time
      await request(app.getHttpServer()).post('/auth/register').send(registerDto).expect(201);

      // Try to register again with same email
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(409);

      expect(response.body.message).toBe('Email already exists');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await request(app.getHttpServer()).post('/auth/register').send(registerDto);
    });

    it('should login successfully with correct credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Login successful',
        user: {
          email: loginDto.email,
          displayName: null,
        },
      });

      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('access_token=');
    });

    it('should return 401 on bad password', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
      expect(response.headers['set-cookie']).toBeUndefined();
    });

    it('should return 401 on non-existent email', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /auth/me', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Register and get access token
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer()).post('/auth/register').send(registerDto);

      // Extract token from cookie
      const cookieHeader = response.headers['set-cookie'][0];
      accessToken = cookieHeader.split('access_token=')[1].split(';')[0];
    });

    it('should return current user with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        user: {
          email: 'test@example.com',
          displayName: null,
        },
      });
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });
  });
});
