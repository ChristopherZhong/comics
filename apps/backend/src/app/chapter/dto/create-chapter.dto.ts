import { PickType } from '@nestjs/swagger';
import { Chapter } from '../entities/chapter.entity';

export class CreateChapterDto extends PickType(Chapter, [
  'comicId',
  'title',
  'chapterNumber',
  'pagesCount',
  'scanlationGroupId',
] as const) {}
