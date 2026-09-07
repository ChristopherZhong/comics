import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProgressStatus } from '../../../generated/prisma/enums';

export class ReadingEventLog {
  @ApiProperty({ description: 'The unique identifier for the reading event log' })
  id: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'User who created the log' })
  createdBy?: string | null;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'User who last updated the log' })
  updatedBy?: string | null;

  @ApiProperty({ description: 'ID of the chapter' })
  chapterId: string;

  @ApiProperty({ description: 'ID of the user' })
  userId: string;

  @ApiProperty({ enum: ProgressStatus, enumName: 'ProgressStatus', description: 'Progress status recorded in log' })
  status: ProgressStatus;

  @ApiProperty({ description: 'Timestamp of the event' })
  timestamp: Date;
}
