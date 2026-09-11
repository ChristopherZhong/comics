import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { FindManyChaptersOptions } from './dto/find-many-options.dto';
import { transformCreateChapter } from './transformations';
import {
  PaginationResult,
  PaginationStrategyRegistry,
} from '../common/pagination/pagination.strategy';
import { Chapter } from './entities/chapter.entity';

@Injectable()
export class ChapterService {
  constructor(
    private paginationRegistry: PaginationStrategyRegistry,
    private prisma: PrismaService
  ) {}

  /**
   * Create a new chapter in a comic series.
   *
   * @param data Chapter creation payload.
   * @returns Created chapter record with scanlation groups.
   */
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

  /**
   * Find chapters for a comic series with strategy-pattern pagination.
   *
   * @param options FindMany options including comic ID filter and pagination.
   * @returns Paginated list of chapters.
   */
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

    const strategy = this.paginationRegistry.getStrategy<Chapter>(pagination);
    return strategy.paginate(
      this.prisma,
      'chapter',
      pagination,
      queryInclude,
      where,
      orderBy
    );
  }

  /**
   * Find a chapter by ID with comic and scanlation groups included.
   *
   * @param id Unique identifier of the chapter.
   * @returns Chapter record or null if not found.
   */
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

  /**
   * Update an existing chapter by ID.
   *
   * @param id Unique identifier of the chapter.
   * @param data Partial chapter payload to update.
   * @returns Updated chapter record.
   */
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

  /**
   * Remove a chapter by ID.
   *
   * @param id Unique identifier of the chapter to remove.
   * @returns Deleted chapter record.
   */
  async remove(id: string): Promise<Chapter> {
    return this.prisma.chapter.delete({ where: { id } });
  }
}
