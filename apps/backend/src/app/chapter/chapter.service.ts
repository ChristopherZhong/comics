import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { FindManyChaptersOptions } from './dto/find-many-options.dto';
import { transformCreateChapter } from './transformations';
import {
  PaginationResult,
  PaginationStrategyRegistry,
  PaginationType,
} from '../common/pagination/pagination.strategy';
import { Chapter } from './entities/chapter.entity';

@Injectable()
export class ChapterService {
  constructor(
    private paginationRegistry: PaginationStrategyRegistry,
    private prisma: PrismaService
  ) {}

  async create(data: CreateChapterDto): Promise<Chapter> {
    const prismaData = transformCreateChapter(data);
    return this.prisma.chapter.create({
      data: prismaData,
      include: {
        scanlationGroups: {
          include: { scanlationGroup: true },
        },
      },
    });
  }

  async findMany(
    options: FindManyChaptersOptions = {}
  ): Promise<PaginationResult<Chapter>> {
    const pagination = options.pagination || {};
    const where = options.comicId ? { comicId: options.comicId } : undefined;
    const queryInclude = {
      scanlationGroups: {
        include: { scanlationGroup: true },
      },
    };
    const orderBy = { chapterNumber: 'asc' };

    const strategyType: PaginationType = pagination.cursor ? 'cursor' : 'offset';
    const strategy = this.paginationRegistry.getStrategy<Chapter>(strategyType);
    return strategy.paginate(
      this.prisma,
      'chapter',
      pagination,
      queryInclude,
      where,
      orderBy
    );
  }

  async findOne(id: string): Promise<Chapter | null> {
    return this.prisma.chapter.findUnique({
      include: {
        comic: true,
        scanlationGroups: {
          include: { scanlationGroup: true },
        },
      },
      where: { id },
    });
  }

  async update(id: string, data: UpdateChapterDto): Promise<Chapter> {
    const { scanlationGroupIds, ...chapterData } = data;
    return this.prisma.chapter.update({
      data: {
        ...chapterData,
        scanlationGroups: scanlationGroupIds
          ? {
              create: scanlationGroupIds.map((groupId) => ({
                scanlationGroupId: groupId,
              })),
              deleteMany: {},
            }
          : undefined,
      },
      include: {
        scanlationGroups: {
          include: { scanlationGroup: true },
        },
      },
      where: { id },
    });
  }

  async remove(id: string): Promise<Chapter> {
    return this.prisma.chapter.delete({ where: { id } });
  }
}
