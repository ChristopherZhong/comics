import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Chapter {
  @ApiProperty({ description: 'The unique identifier for the chapter' })
  id: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'User who created the chapter' })
  createdBy?: string | null;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'User who last updated the chapter' })
  updatedBy?: string | null;

  @ApiProperty({ description: 'ID of the comic series this chapter belongs to' })
  comicId: string;

  @ApiProperty({ description: 'Title of the chapter' })
  title: string;

  @ApiProperty({ description: 'Chapter number', example: 1.0 })
  chapterNumber: number;

  @ApiProperty({ description: 'Total number of pages in the chapter', example: 24 })
  pagesCount: number;
}
