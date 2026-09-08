import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { FindManyLogsOptions } from './dto/find-many-logs.dto';
import {
  CursorPaginationStrategy,
  OffsetPaginationStrategy,
  PaginationResult,
} from '../common/pagination/pagination.strategy';
import { ReadingProgress } from './entities/reading-progress.entity';
import { ReadingEventLog } from './entities/reading-event-log.entity';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getUserProgress(userId: string): Promise<ReadingProgress[]> {
    return this.prisma.readingProgress.findMany({
      include: {
        chapter: {
          include: { comic: true },
        },
      },
      where: { userId },
    });
  }

  async updateProgress(
    userId: string,
    dto: UpdateProgressDto
  ): Promise<ReadingProgress> {
    const { chapterId, status } = dto;

    // 1. Upsert reading progress status
    const progress = await this.prisma.readingProgress.upsert({
      create: { chapterId, status, userId },
      update: { status },
      where: {
        userId_chapterId: { chapterId, userId },
      },
    });

    // 2. Create audit event log
    await this.prisma.readingEventLog.create({
      data: {
        chapterId,
        status,
        userId,
      },
    });

    return progress;
  }

  async getEventLogs(
    options: FindManyLogsOptions = {}
  ): Promise<PaginationResult<ReadingEventLog>> {
    const pagination = options.pagination || {};
    const where = options.userId ? { userId: options.userId } : undefined;
    const queryInclude = {
      chapter: {
        include: { comic: true },
      },
      user: { select: { email: true } },
    };
    const orderBy = { timestamp: 'desc' };

    if (pagination.cursor) {
      const strategy = new CursorPaginationStrategy<ReadingEventLog>();
      return strategy.paginate(
        this.prisma,
        'readingEventLog',
        pagination,
        queryInclude,
        where,
        orderBy
      );
    } else {
      const strategy = new OffsetPaginationStrategy<ReadingEventLog>();
      return strategy.paginate(
        this.prisma,
        'readingEventLog',
        pagination,
        queryInclude,
        where,
        orderBy
      );
    }
  }
}
