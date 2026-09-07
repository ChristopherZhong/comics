import { PrismaService } from '../../prisma/prisma.service';
import { PaginationOptions } from '../../comic/dto/find-many-options.dto';

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
    modelName: 'comic' | 'chapter' | 'readingEventLog',
    options: PaginationOptions,
    queryInclude?: any,
    where?: any,
    orderBy?: any
  ): Promise<PaginationResult<T>>;
}

export class OffsetPaginationStrategy<T> implements PaginationStrategy<T> {
  async paginate(
    prisma: PrismaService,
    modelName: 'comic' | 'chapter' | 'readingEventLog',
    options: PaginationOptions,
    queryInclude?: any,
    where?: any,
    orderBy?: any
  ): Promise<PaginationResult<T>> {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 20);
    const skip = (page - 1) * limit;

    const delegate = (prisma as any)[modelName];

    const [items, total] = await Promise.all([
      delegate.findMany({
        where,
        skip,
        take: limit,
        include: queryInclude,
        orderBy: orderBy || { createdAt: 'desc' },
      }),
      delegate.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export class CursorPaginationStrategy<T> implements PaginationStrategy<T> {
  async paginate(
    prisma: PrismaService,
    modelName: 'comic' | 'chapter' | 'readingEventLog',
    options: PaginationOptions,
    queryInclude?: any,
    where?: any,
    orderBy?: any
  ): Promise<PaginationResult<T>> {
    const limit = Number(options.limit || 20);
    const cursor = options.cursor;

    const delegate = (prisma as any)[modelName];

    const items = await delegate.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
      include: queryInclude,
      orderBy: orderBy || { id: 'asc' },
    });

    let nextCursor: string | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }

    return {
      items,
      nextCursor,
      limit,
    };
  }
}
