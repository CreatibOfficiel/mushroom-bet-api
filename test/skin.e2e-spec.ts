import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateSkinDto } from './../src/skin/dto/create-skin.dto';

describe('SkinController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaClient)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Clear and seed the database before tests
    await prisma.skin.deleteMany({});
    const characters = [
      'MARIO',
      'PEACH',
      'YOSHI',
      'LUIGI',
      'SHY_GUY',
      'DAISY',
      'ROSALINA',
      'TOAD',
      'BABY_ROSALINA',
      'WARIO',
      'TOADETTE',
      'BABY_MARIO',
      'BABY_LUIGI',
      'BABY_PEACH',
      'BABY_DAISY',
      'BOWSER',
      'DONKEY_KONG',
      'WALUIGI',
      'GOOMBA',
      'KOOPA_TROOPA',
      'PIRANHA_PLANT',
      'HAMMER_BRO',
      'CHARGIN_CHUCK',
      'MONTY_MOLE',
      'POKEY',
      'PARA_BIDDYBUD',
      'SPIKE',
      'WIGGLER',
      'NABBIT',
      'PIANTA',
      'MOO_MOO',
      'PENGUIN',
      'SIDESTEPPER',
      'SNOWMAN',
      'STINGBY',
      'CATAQUACK',
      'CHEEP_CHEEP',
      'FISH_BONE',
      'DOLPHIN',
      'ROCKY_WRENCH',
      'LAKITU',
      'DRY_BONES',
    ];
    const skins: CreateSkinDto[] = [];
    for (let i = 0; i < 127; i++) {
      skins.push({
        name: `Skin${i}`,
        character: characters[i % characters.length],
      } as CreateSkinDto);
    }
    await prisma.skin.createMany({ data: skins });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  it('GET /skins should return 127 rows after seeding', async () => {
    const response = await request(app.getHttpServer()).get('/skins').expect(200);
    expect(response.body.length).toBe(127);
  });
});
