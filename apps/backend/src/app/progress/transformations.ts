import { UpdateProgressDto } from './dto/update-progress.dto';

/**
 * Transform user ID and UpdateProgressDto into reading progress payload.
 *
 * @param userId Unique identifier of the user updating progress.
 * @param dto Payload containing chapter ID and status.
 * @returns Object formatted with userId, chapterId, and status.
 */
export function transformUpdateProgress(userId: string, dto: UpdateProgressDto) {
  return {
    chapterId: dto.chapterId,
    status: dto.status,
    userId,
  };
}
