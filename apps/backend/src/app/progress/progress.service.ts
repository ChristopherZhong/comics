import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { FindManyLogsOptions } from './dto/find-many-logs.dto';
import {
  PaginationResult,
  PaginationStrategyRegistry,
} from '../common/pagination/pagination.strategy';
import { ReadingProgress } from './entities/reading-progress.entity';
import { ReadingEventLog } from './entities/reading-event-log.entity';

@Injectable()
export class ProgressService {
  constructor(
    private paginationRegistry: PaginationStrategyRegistry,
    private prisma: PrismaService
  ) {}

  /**
   * Get all chapter reading progress records for a user.
   *
   * @param userId Unique identifier of the user.
   * @returns Array of reading progress records with chapter and comic details.
   */
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

  /**
   * Upsert reading progress for a user and log the audit event.
   *
   * @param userId Unique identifier of the user.
   * @param dto Payload containing chapter ID and progress status.
   * @returns Upserted reading progress record.
   */
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

  /**
   * Get paginated reading event logs for a specific user or globally.
   *
   * @param options FindMany options with optional user ID filter and pagination.
   * @returns Paginated list of reading event logs.
   */
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

    const strategy = this.paginationRegistry.getStrategy<ReadingEventLog>(pagination);
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
