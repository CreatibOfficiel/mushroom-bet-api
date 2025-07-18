import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Character, Skin } from '@prisma/client';
import { CreateManySkinsDto, CreateSkinDto } from './dto/create-skin.dto';
import { SkinService } from './skin.service';

@Controller('skins')
export class SkinController {
  constructor(private readonly skinService: SkinService) {}

  @Get()
  async findAll(@Query('character') character?: string): Promise<Skin[]> {
    return await this.skinService.findAll(character ? (character as Character) : undefined);
  }

  @Post()
  async create(@Body() createSkinDto: CreateSkinDto): Promise<Skin> {
    return await this.skinService.create(createSkinDto);
  }

  @Post('bulk')
  async createMany(@Body() createManySkinsDto: CreateManySkinsDto): Promise<any> {
    return await this.skinService.createMany(createManySkinsDto);
  }
}
