import { ApiProperty } from '@nestjs/swagger';
import { ProgressStatus } from '../../../generated/prisma/enums';

export class UpdateProgressDto {
  @ApiProperty({ description: 'ID of the chapter to update progress for' })
  chapterId: string;

  @ApiProperty({ enum: ProgressStatus, enumName: 'ProgressStatus', description: 'Progress status' })
  status: ProgressStatus;
}
