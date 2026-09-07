import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { FindManyLogsOptions } from './dto/find-many-logs.dto';
import {
  CursorPaginationStrategy,
  OffsetPaginationStrategy,
  PaginationResult,
} from '../common/pagination/pagination.strategy';
import { ReadingEventLog } from './entities/reading-event-log.entity';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getUserProgress(userId: string) {
    return this.prisma.readingProgress.findMany({
      where: { userId },
      include: {
        chapter: {
          include: { comic: true },
        },
      },
    });
  }

  async updateProgress(userId: string, dto: UpdateProgressDto) {
    const { chapterId, status } = dto;

    // 1. Upsert reading progress status
    const progress = await this.prisma.readingProgress.upsert({
      where: {
        userId_chapterId: { userId, chapterId },
      },
      update: { status },
      create: { userId, chapterId, status },
    });

    // 2. Create audit event log
    await this.prisma.readingEventLog.create({
      data: {
        userId,
        chapterId,
        status,
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
      user: { select: { email: true } },
      chapter: {
        include: { comic: true },
      },
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
