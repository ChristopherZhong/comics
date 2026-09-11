import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationOptions } from '../../comic/dto/find-many-options.dto';

export type SupportedModel = 'comic' | 'chapter' | 'readingEventLog';
export type PaginationType = 'offset' | 'cursor';

export interface PaginationResult<T> {
  items: T[];
  total?: number;
  page?: number;
  limit: number;
  totalPages?: number;
  nextCursor?: string;
}

export interface PaginationStrategy<T> {
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
  private readonly strategies = new Map<PaginationType, PaginationStrategy<unknown>>();

  constructor() {
    this.strategies.set('offset', new OffsetPaginationStrategy());
    this.strategies.set('cursor', new CursorPaginationStrategy());
  }

  getStrategy<T>(type: PaginationType): PaginationStrategy<T> {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`Pagination strategy '${type}' is not registered.`);
    }
    return strategy as PaginationStrategy<T>;
  }
}
