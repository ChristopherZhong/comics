import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComic } from './dto/create-comic.dto';
import { transformCreateComic } from './transformations';
import { FindManyOptions } from './dto/find-many-options.dto';
import {
  CursorPaginationStrategy,
  OffsetPaginationStrategy,
  PaginationResult,
} from '../common/pagination/pagination.strategy';
import { Comic } from './entities/comic.entity';

@Injectable()
export class ComicService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateComic) {
    const prismaData = transformCreateComic(data);
    return this.prisma.comic.create({
      data: prismaData as any,
      include: {
        scanlationGroups: true,
      },
    });
  }

  async findMany(options: FindManyOptions = {}): Promise<PaginationResult<Comic>> {
    const pagination = options.pagination || {};
    const queryInclude = {
      chapters: {
        orderBy: { chapterNumber: 'asc' },
      },
      scanlationGroups: true,
    };

    if (pagination.cursor) {
      const strategy = new CursorPaginationStrategy<Comic>();
      return strategy.paginate(this.prisma, 'comic', pagination, queryInclude);
    } else {
      const strategy = new OffsetPaginationStrategy<Comic>();
      return strategy.paginate(this.prisma, 'comic', pagination, queryInclude);
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
