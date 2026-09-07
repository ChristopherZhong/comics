import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PublicationStatus, ComicType } from '../../../generated/prisma/enums';

export class CreateComic {
  @ApiProperty({ description: 'Title of the comic' })
  title: string;

  @ApiPropertyOptional({ description: 'Detailed description of the comic' })
  description?: string;

  @ApiPropertyOptional({ description: 'Publisher of the comic' })
  publisher?: string;

  @ApiPropertyOptional({ description: 'Cover image URL' })
  coverUrl?: string;

  @ApiPropertyOptional({ description: 'Writer of the comic' })
  writer?: string;

  @ApiPropertyOptional({ description: 'Artist of the comic' })
  artist?: string;

  @ApiPropertyOptional({ description: 'ISO 639-1 language code (e.g. "en", "ja", "ko")', example: 'en' })
  language?: string;

  @ApiPropertyOptional({ enum: PublicationStatus, enumName: 'PublicationStatus', description: 'Publication status' })
  status?: PublicationStatus;

  @ApiPropertyOptional({ enum: ComicType, enumName: 'ComicType', description: 'Type of comic' })
  type?: ComicType;

  @ApiPropertyOptional({ type: [String], description: 'List of Scanlation Group IDs translating this comic' })
  scanlationGroupIds?: string[];
}
