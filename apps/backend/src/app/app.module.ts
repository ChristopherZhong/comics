import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ChapterModule } from './chapter/chapter.module';
import { ComicModule } from './comic/comic.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [AuthModule, ChapterModule, ComicModule, PrismaModule, ProgressModule],
})
export class AppModule {}
