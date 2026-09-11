import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationOptions } from '../../comic/dto/find-many-options.dto';

export type SupportedModel = 'comic' | 'chapter' | 'readingEventLog';

export interface PaginationResult<T> {
  items: T[];
  total?: number;
  page?: number;
  limit: number;
  totalPages?: number;
  nextCursor?: string;
}

export interface PaginationStrategy<T> {
  /**
   * Execute pagination query against Prisma.
   *
   * @param prisma Prisma database service instance.
   * @param modelName Target model key on PrismaService.
   * @param options Pagination parameters (page, limit, cursor).
   * @param queryInclude Optional relations to include.
   * @param where Optional filter criteria.
   * @param orderBy Optional order clause.
   * @returns Paginated result set containing items and metadata.
   */
  paginate(
    prisma: PrismaService,
    modelName: SupportedModel,
    options: PaginationOptions,
    queryInclude?: Record<string, unknown>,
    where?: Record<string, unknown>,
    orderBy?: Record<string, unknown>
  ): Promise<PaginationResult<T>>;
}

export class OffsetPaginationStrategy<T> implements PaginationStrategy<T> {
  /**
   * Paginate results using page-based offset and total count.
   *
   * @param prisma Prisma database service instance.
   * @param modelName Target model key on PrismaService.
   * @param options Offset options containing page and limit.
   * @param queryInclude Optional relations to include in Prisma query.
   * @param where Optional Prisma where filter clause.
   * @param orderBy Optional Prisma order clause.
   * @returns Paginated result object with total count and total pages.
   */
  async paginate(
    prisma: PrismaService,
    modelName: SupportedModel,
    options: PaginationOptions,
    queryInclude?: Record<string, unknown>,
    where?: Record<string, unknown>,
    orderBy?: Record<string, unknown>
  ): Promise<PaginationResult<T>> {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 20);
    const skip = (page - 1) * limit;

    const delegate = prisma[modelName] as unknown as {
      findMany: (args: unknown) => Promise<T[]>;
      count: (args?: unknown) => Promise<number>;
    };

    const [items, total] = await Promise.all([
      delegate.findMany({
        include: queryInclude,
        orderBy: orderBy || { createdAt: 'desc' },
        skip,
        take: limit,
        where,
      }),
      delegate.count({ where }),
    ]);

    return {
      items,
      limit,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export class CursorPaginationStrategy<T> implements PaginationStrategy<T> {
  /**
   * Paginate results using cursor ID and limit parameters.
   *
   * @param prisma Prisma database service instance.
   * @param modelName Target model key on PrismaService.
   * @param options Cursor options containing cursor ID and limit.
   * @param queryInclude Optional relations to include in Prisma query.
   * @param where Optional Prisma where filter clause.
   * @param orderBy Optional Prisma order clause.
   * @returns Paginated result object with nextCursor pointer.
   */
  async paginate(
    prisma: PrismaService,
    modelName: SupportedModel,
    options: PaginationOptions,
    queryInclude?: Record<string, unknown>,
    where?: Record<string, unknown>,
    orderBy?: Record<string, unknown>
  ): Promise<PaginationResult<T>> {
    const limit = Number(options.limit || 20);
    const cursor = options.cursor;

    const delegate = prisma[modelName] as unknown as {
      findMany: (args: unknown) => Promise<T[]>;
    };

    const items = await delegate.findMany({
      cursor: cursor ? { id: cursor } : undefined,
      include: queryInclude,
      orderBy: orderBy || { id: 'asc' },
      skip: cursor ? 1 : undefined,
      take: limit + 1,
      where,
    });

    let nextCursor: string | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop() as unknown as { id: string } | undefined;
      nextCursor = nextItem?.id;
    }

    return {
      items,
      limit,
      nextCursor,
    };
  }
}

@Injectable()
export class PaginationStrategyRegistry {
  private readonly cursorStrategy = new CursorPaginationStrategy<unknown>();
  private readonly offsetStrategy = new OffsetPaginationStrategy<unknown>();

  /**
   * Determine and return the appropriate pagination strategy based on options.
   *
   * @param options Pagination options containing cursor or page settings.
   * @returns CursorPaginationStrategy if cursor is provided, else OffsetPaginationStrategy.
   */
  getStrategy<T>(options: PaginationOptions = {}): PaginationStrategy<T> {
    if (options.cursor) {
      return this.cursorStrategy as PaginationStrategy<T>;
    }
    return this.offsetStrategy as PaginationStrategy<T>;
  }
}
