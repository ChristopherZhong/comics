import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ComicService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    description?: string;
    publisher?: string;
    coverUrl?: string;
    writer?: string;
    artist?: string;
  }) {
    return this.prisma.comic.create({ data });
  }

  async findMany(page = 1, limit = 20) {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [items, total] = await Promise.all([
      this.prisma.comic.findMany({
        skip,
        take,
        include: {
          chapters: {
            orderBy: { chapterNumber: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.comic.count(),
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
    return this.prisma.comic.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' },
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      publisher?: string;
      coverUrl?: string;
      writer?: string;
      artist?: string;
    }
  ) {
    return this.prisma.comic.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.comic.delete({ where: { id } });
  }
}
