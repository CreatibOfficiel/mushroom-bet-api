import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SkinController } from './skin.controller';
import { SkinService } from './skin.service';

@Module({
  imports: [PrismaModule],
  controllers: [SkinController],
  providers: [SkinService],
  exports: [SkinService],
})
export class SkinModule {}
