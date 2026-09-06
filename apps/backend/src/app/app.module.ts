import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { ComicModule } from './comic/comic.module';
import { ChapterModule } from './chapter/chapter.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [PrismaModule, AuthModule, ComicModule, ChapterModule, ProgressModule],
})
export class AppModule {}
