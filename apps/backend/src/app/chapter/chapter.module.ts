import { Module } from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';

@Module({
  controllers: [ChapterController],
  exports: [ChapterService],
  providers: [ChapterService],
})
export class ChapterModule {}
