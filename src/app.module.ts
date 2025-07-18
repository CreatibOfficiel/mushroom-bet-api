import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SkinModule } from './skin/skin.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, SkinModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
