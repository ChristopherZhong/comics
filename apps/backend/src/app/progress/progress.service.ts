import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProgressStatus } from '../../generated/prisma/enums.js';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getUserProgress(userId: number) {
    return this.prisma.readingProgress.findMany({
      where: { userId },
      include: {
        chapter: {
          include: { comic: true },
        },
      },
    });
  }

  async updateProgress(userId: number, chapterId: number, status: ProgressStatus) {
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

  async getEventLogs(userId?: number) {
    return this.prisma.readingEventLog.findMany({
      where: userId ? { userId } : {},
      orderBy: { timestamp: 'desc' },
      include: {
        user: { select: { email: true } },
        chapter: {
          include: { comic: true },
        },
      },
    });
  }
}
