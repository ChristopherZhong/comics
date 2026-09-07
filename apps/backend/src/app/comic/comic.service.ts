import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComic } from './dto/create-comic.dto';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  cursor?: string;
}

@Injectable()
export class ComicService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateComic) {
    const { scanlationGroupIds, ...comicData } = data;
    return this.prisma.comic.create({
      data: {
        ...comicData,
        scanlationGroups: scanlationGroupIds
          ? { connect: scanlationGroupIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        scanlationGroups: true,
      },
    });
  }

  async findMany(options: PaginationOptions = {}) {
    const { page, limit = 20, cursor } = options;
    const take = Number(limit);

    if (cursor) {
      // Cursor-based pagination
      const items = await this.prisma.comic.findMany({
        take: take + 1, // Fetch one extra to determine if there is a next page
        cursor: { id: cursor },
        include: {
          chapters: {
            orderBy: { chapterNumber: 'asc' },
          },
          scanlationGroups: true,
        },
        orderBy: { id: 'asc' },
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > take) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
        limit: take,
      };
    } else {
      // Offset-based pagination
      const currentPage = Number(page || 1);
      const skip = (currentPage - 1) * take;

      const [items, total] = await Promise.all([
        this.prisma.comic.findMany({
          skip,
          take,
          include: {
            chapters: {
              orderBy: { chapterNumber: 'asc' },
            },
            scanlationGroups: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.comic.count(),
      ]);

      return {
        items,
        total,
        page: currentPage,
        limit: take,
        totalPages: Math.ceil(total / take),
      };
    }
  }

  async findOne(id: string) {
    return this.prisma.comic.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' },
        },
        scanlationGroups: true,
      },
    });
  }

  async update(id: string, data: Partial<CreateComic>) {
    const { scanlationGroupIds, ...comicData } = data;
    return this.prisma.comic.update({
      where: { id },
      data: {
        ...comicData,
        scanlationGroups: scanlationGroupIds
          ? { set: scanlationGroupIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        scanlationGroups: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.comic.delete({ where: { id } });
  }
}
