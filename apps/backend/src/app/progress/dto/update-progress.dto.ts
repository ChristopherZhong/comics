import { PickType } from '@nestjs/swagger';
import { ReadingProgress } from '../entities/reading-progress.entity';

export class UpdateProgressDto extends PickType(ReadingProgress, ['chapterId', 'status'] as const) {}
