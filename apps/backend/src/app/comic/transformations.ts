import { CreateComic } from './dto/create-comic.dto';

export function transformCreateComic(dto: CreateComic) {
  const { scanlationGroupIds, ...comicData } = dto;

  return {
    ...comicData,
    scanlationGroups: scanlationGroupIds
      ? {
          create: scanlationGroupIds.map((groupId) => ({
            scanlationGroupId: groupId,
          })),
        }
      : undefined,
  };
}
