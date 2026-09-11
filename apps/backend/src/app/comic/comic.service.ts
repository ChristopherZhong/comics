import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComic } from './dto/create-comic.dto';
import { transformCreateComic } from './transformations';
import { FindManyOptions } from './dto/find-many-options.dto';
import {
  PaginationResult,
  PaginationStrategyRegistry,
} from '../common/pagination/pagination.strategy';
import { Comic } from './entities/comic.entity';

@Injectable()
export class ComicService {
  constructor(
    private paginationRegistry: PaginationStrategyRegistry,
    private prisma: PrismaService
  ) {}

  /**
   * Create a new comic series in the database.
   *
   * @param data Creation payload for the comic series.
   * @returns Newly created comic record with scanlation groups.
   */
  async create(data: CreateComic): Promise<Comic> {
    const prismaData = transformCreateComic(data);
    return this.prisma.comic.create({
      data: prismaData,
      include: {
        scanlationGroups: {
          include: { scanlationGroup: true },
        },
      },
    });
  }

  /**
   * Retrieve comic series using strategy-pattern pagination.
   *
   * @param options Pagination options including cursor or offset parameters.
   * @returns Paginated list of comic records.
   */
  async findMany(options: FindManyOptions = {}): Promise<PaginationResult<Comic>> {
    const pagination = options.pagination || {};
    const queryInclude = {
      chapters: {
        orderBy: { chapterNumber: 'asc' },
      },
      scanlationGroups: {
        include: { scanlationGroup: true },
      },
    };

    const strategy = this.paginationRegistry.getStrategy<Comic>(pagination);
    return strategy.paginate(this.prisma, 'comic', pagination, queryInclude);
  }

  /**
   * Find a single comic series by ID with chapters and scanlation groups.
   *
   * @param id Unique identifier of the comic.
   * @returns Comic record or null if not found.
   */
  async findOne(id: string): Promise<Comic | null> {
    return this.prisma.comic.findUnique({
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' },
        },
        scanlationGroups: {
          include: { scanlationGroup: true },
        },
      },
      where: { id },
    });
  }

  /**
   * Update an existing comic series.
   *
   * @param id Unique identifier of the comic.
   * @param data Partial comic fields to update.
   * @returns Updated comic record.
   */
  async update(id: string, data: Partial<CreateComic>): Promise<Comic> {
    const { scanlationGroupIds, ...comicData } = data;
    return this.prisma.comic.update({
      data: {
        ...comicData,
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
   * Delete a comic series by ID.
   *
   * @param id Unique identifier of the comic to remove.
   * @returns Deleted comic record.
   */
  async remove(id: string): Promise<Comic> {
    return this.prisma.comic.delete({ where: { id } });
  }
}
