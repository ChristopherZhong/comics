import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ComicService {
  constructor(private prisma: PrismaService) {}

  async getAllComics() {
    return this.prisma.comic.findMany({
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' },
        },
      },
    });
  }

  async getComicById(id: string) {
    return this.prisma.comic.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' },
        },
      },
    });
  }

  async createComic(data: {
    title: string;
    description?: string;
    publisher?: string;
    coverUrl?: string;
    writer?: string;
    artist?: string;
  }) {
    return this.prisma.comic.create({ data });
  }

  async addChapter(
    comicId: string,
    data: { title: string; chapterNumber: number; pagesCount: number }
  ) {
    return this.prisma.chapter.create({
      data: {
        comicId,
        title: data.title,
        chapterNumber: data.chapterNumber,
        pagesCount: data.pagesCount,
      },
    });
  }

  async deleteComic(id: string) {
    return this.prisma.comic.delete({ where: { id } });
  }
}
