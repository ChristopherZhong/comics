import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProgressStatus } from '../../../generated/prisma/enums';

export class ReadingProgress {
  @ApiProperty({ description: 'The unique identifier for the reading progress' })
  id: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'User who created the progress record' })
  createdBy?: string | null;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'User who last updated the progress record' })
  updatedBy?: string | null;

  @ApiProperty({ description: 'ID of the chapter being tracked' })
  chapterId: string;

  @ApiProperty({ description: 'ID of the user tracking progress' })
  userId: string;

  @ApiProperty({ enum: ProgressStatus, enumName: 'ProgressStatus', description: 'Reading progress status' })
  status: ProgressStatus;
}
