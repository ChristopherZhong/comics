import { CreateComic } from './dto/create-comic.dto';

/**
 * Transform CreateComic DTO to Prisma comic creation input structure.
 *
 * @param dto CreateComic DTO containing form input and scanlationGroupIds.
 * @returns Formatted object ready for Prisma comic.create().
 */
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
