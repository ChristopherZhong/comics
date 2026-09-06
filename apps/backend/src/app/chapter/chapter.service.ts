import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChapterService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    comicId: string;
    title: string;
    chapterNumber: number;
    pagesCount: number;
  }) {
    return this.prisma.chapter.create({
      data: {
        comicId: data.comicId,
        title: data.title,
        chapterNumber: data.chapterNumber,
        pagesCount: data.pagesCount,
      },
    });
  }

  async findMany(comicId?: string, page = 1, limit = 20) {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const where = comicId ? { comicId } : {};

    const [items, total] = await Promise.all([
      this.prisma.chapter.findMany({
        where,
        skip,
        take,
        orderBy: { chapterNumber: 'asc' },
      }),
      this.prisma.chapter.count({ where }),
    ]);

    return {
      items,
      total,
      page: Number(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findOne(id: string) {
    return this.prisma.chapter.findUnique({
      where: { id },
      include: { comic: true },
    });
  }

  async update(
    id: string,
    data: { title?: string; chapterNumber?: number; pagesCount?: number }
  ) {
    return this.prisma.chapter.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.chapter.delete({ where: { id } });
  }
}
