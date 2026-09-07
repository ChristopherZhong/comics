import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChapterDto {
  @ApiPropertyOptional({ description: 'ID of the comic series this chapter belongs to' })
  comicId?: string;

  @ApiPropertyOptional({ description: 'Title of the chapter' })
  title?: string;

  @ApiPropertyOptional({ description: 'Chapter number', example: 1.0 })
  chapterNumber?: number;

  @ApiPropertyOptional({ description: 'Total number of pages in the chapter', example: 24 })
  pagesCount?: number;
}
