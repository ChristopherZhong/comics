import { CreateChapterDto } from './dto/create-chapter.dto';

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
