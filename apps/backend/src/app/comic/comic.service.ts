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

  async create(data: CreateComic): Promise<Comic> {
    const prismaData = transformCreateComic(data);
    return this.prisma.comic.create({
      data: prismaData,
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

  async findOne(id: string): Promise<Comic | null> {
    return this.prisma.comic.findUnique({
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' },
        },
        scanlationGroups: true,
      },
      where: { id },
    });
  }

  async update(id: string, data: Partial<CreateComic>): Promise<Comic> {
    const { scanlationGroupIds, ...comicData } = data;
    return this.prisma.comic.update({
      data: {
        ...comicData,
        scanlationGroups: scanlationGroupIds
          ? { set: scanlationGroupIds.map((groupId) => ({ id: groupId })) }
          : undefined,
      },
      include: {
        scanlationGroups: true,
      },
      where: { id },
    });
  }

  async remove(id: string): Promise<Comic> {
    return this.prisma.comic.delete({ where: { id } });
  }
}
