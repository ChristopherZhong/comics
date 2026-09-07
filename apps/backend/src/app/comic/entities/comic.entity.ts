import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PublicationStatus, ComicType } from '../../../generated/prisma/enums';

export class Comic {
  @ApiProperty({ description: 'The unique identifier for the comic' })
  id: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'User who created the comic' })
  createdBy?: string | null;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'User who last updated the comic' })
  updatedBy?: string | null;

  @ApiProperty({ description: 'Title of the comic' })
  title: string;

  @ApiPropertyOptional({ description: 'Detailed description of the comic' })
  description?: string | null;

  @ApiPropertyOptional({ description: 'Publisher of the comic' })
  publisher?: string | null;

  @ApiPropertyOptional({ description: 'Cover image URL' })
  coverUrl?: string | null;

  @ApiPropertyOptional({ description: 'Writer of the comic' })
  writer?: string | null;

  @ApiPropertyOptional({ description: 'Artist of the comic' })
  artist?: string | null;

  @ApiPropertyOptional({ description: 'ISO 639-1 language code (e.g. "en", "ja", "ko")', example: 'en' })
  language?: string | null;

  @ApiPropertyOptional({ enum: PublicationStatus, enumName: 'PublicationStatus', description: 'Publication status' })
  status?: PublicationStatus;

  @ApiPropertyOptional({ enum: ComicType, enumName: 'ComicType', description: 'Type of comic' })
  type?: ComicType;
}
