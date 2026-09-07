import { UpdateProgressDto } from './dto/update-progress.dto';

export function transformUpdateProgress(userId: string, dto: UpdateProgressDto) {
  return {
    userId,
    chapterId: dto.chapterId,
    status: dto.status,
  };
}
