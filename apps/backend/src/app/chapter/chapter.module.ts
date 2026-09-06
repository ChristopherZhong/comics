import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';

@Module({
  providers: [ChapterService],
  controllers: [ChapterController],
  exports: [ChapterService],
})
export class ChapterModule {}
