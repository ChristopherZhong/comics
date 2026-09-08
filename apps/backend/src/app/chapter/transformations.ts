import { CreateChapterDto } from './dto/create-chapter.dto';

export function transformCreateChapter(dto: CreateChapterDto) {
  return {
    chapterNumber: dto.chapterNumber,
    comicId: dto.comicId,
    pagesCount: dto.pagesCount ?? 0,
    scanlationGroupId: dto.scanlationGroupId || null,
    title: dto.title,
  };
}
