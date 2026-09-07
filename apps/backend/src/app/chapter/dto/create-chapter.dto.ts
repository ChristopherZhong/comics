import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty({ description: 'ID of the comic series this chapter belongs to' })
  comicId: string;

  @ApiProperty({ description: 'Title of the chapter' })
  title: string;

  @ApiProperty({ description: 'Chapter number', example: 1.0 })
  chapterNumber: number;

  @ApiPropertyOptional({ description: 'Total number of pages in the chapter', example: 24, default: 0 })
  pagesCount?: number;
}
