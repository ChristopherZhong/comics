import { CreateChapterDto } from './dto/create-chapter.dto';

export function transformCreateChapter(dto: CreateChapterDto) {
  return {
    comicId: dto.comicId,
    title: dto.title,
    chapterNumber: dto.chapterNumber,
    pagesCount: dto.pagesCount ?? 0,
  };
}
