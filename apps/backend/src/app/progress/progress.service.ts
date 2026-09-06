import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProgressStatus } from '../../generated/prisma/enums';

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

  async updateProgress(userId: string, chapterId: string, status: ProgressStatus) {
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

  async getEventLogs(userId?: string, page = 1, limit = 20) {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const where = userId ? { userId } : {};

    const [items, total] = await Promise.all([
      this.prisma.readingEventLog.findMany({
        where,
        skip,
        take,
        orderBy: { timestamp: 'desc' },
        include: {
          user: { select: { email: true } },
          chapter: {
            include: { comic: true },
          },
        },
      }),
      this.prisma.readingEventLog.count({ where }),
    ]);

    return {
      items,
      total,
      page: Number(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }
}
