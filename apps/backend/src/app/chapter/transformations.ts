import { CreateChapterDto } from './dto/create-chapter.dto';

/**
 * Transform CreateChapterDto to Prisma chapter creation input structure.
 *
 * @param dto CreateChapterDto containing chapter fields and scanlationGroupIds.
 * @returns Formatted object ready for Prisma chapter.create().
 */
export function transformCreateChapter(dto: CreateChapterDto) {
  const { scanlationGroupIds, ...chapterData } = dto;
  return {
    ...chapterData,
    pagesCount: chapterData.pagesCount ?? 0,
    scanlationGroups: scanlationGroupIds
      ? {
          create: scanlationGroupIds.map((groupId) => ({
            scanlationGroupId: groupId,
          })),
        }
      : undefined,
  };
}
