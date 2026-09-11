import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { FindManyLogsDto } from './dto/find-many-logs.dto';
import { ReadingProgress } from './entities/reading-progress.entity';
import { ReadingEventLog } from './entities/reading-event-log.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { User } from '../auth/user.decorator';
import { PaginationResult } from '../common/pagination/pagination.strategy';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('progress')
@ApiBearerAuth()
@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  /**
   * Get reading progress records for the current user.
   *
   * @param user Authenticated UserEntity extracted via decorator.
   * @returns Array of reading progress objects for the user.
   */
  @Get()
  async getMyProgress(
    @User() user: UserEntity
  ): Promise<ReadingProgress[]> {
    return this.progressService.getUserProgress(user.id);
  }

  /**
   * Update or create reading progress for a chapter.
   *
   * @param user Authenticated UserEntity extracted via decorator.
   * @param dto Payload containing chapter ID and status.
   * @returns Updated reading progress entity.
   */
  @Post('update')
  async updateProgress(
    @User() user: UserEntity,
    @Body() dto: UpdateProgressDto
  ): Promise<ReadingProgress> {
    return this.progressService.updateProgress(user.id, dto);
  }

  /**
   * Get reading activity logs for the current user.
   *
   * @param user Authenticated UserEntity extracted via decorator.
   * @param query Query options for pagination parameters.
   * @returns Paginated result of reading event logs.
   */
  @Get('logs')
  async getMyLogs(
    @User() user: UserEntity,
    @Query() query: FindManyLogsDto
  ): Promise<PaginationResult<ReadingEventLog>> {
    return this.progressService.getEventLogs({
      pagination: {
        cursor: query.cursor,
        limit: query.limit,
        page: query.page,
      },
      userId: user.id,
    });
  }

  /**
   * Get all reading activity logs across all users (admin access).
   *
   * @param query Query options for pagination parameters.
   * @returns Paginated result of reading event logs across users.
   */
  @Get('logs/all')
  async getAllLogs(
    @Query() query: FindManyLogsDto
  ): Promise<PaginationResult<ReadingEventLog>> {
    return this.progressService.getEventLogs({
      pagination: {
        cursor: query.cursor,
        limit: query.limit,
        page: query.page,
      },
    });
  }
}
