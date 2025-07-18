import { Injectable } from '@nestjs/common';
import { Character, Prisma, Skin } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateManySkinsDto, CreateSkinDto } from './dto/create-skin.dto';

@Injectable()
export class SkinService {
  constructor(private prisma: PrismaService) {}

  async findAll(character?: Character): Promise<Skin[]> {
    if (character) {
      return await this.prisma.skin.findMany({
        where: { character },
      });
    }
    return await this.prisma.skin.findMany();
  }

  async create(data: CreateSkinDto): Promise<Skin> {
    return await this.prisma.skin.create({ data });
  }

  async createMany(data: CreateManySkinsDto): Promise<Prisma.BatchPayload> {
    return await this.prisma.skin.createMany({ data: data.skins });
  }
}
