import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { FindManyLogsDto } from './dto/find-many-logs.dto';
import { ReadingProgress } from './entities/reading-progress.entity';
import { ReadingEventLog } from './entities/reading-event-log.entity';
import { PaginationResult } from '../common/pagination/pagination.strategy';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedUserRequest {
  user: {
    id: string;
  };
}

@ApiTags('progress')
@ApiBearerAuth()
@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  /**
   * Get reading progress records for the current user.
   *
   * @param request Authenticated request containing user context.
   * @returns Array of reading progress objects for the user.
   */
  @Get()
  async getMyProgress(
    @Request() request: AuthenticatedUserRequest
  ): Promise<ReadingProgress[]> {
    return this.progressService.getUserProgress(request.user.id);
  }

  /**
   * Update or create reading progress for a chapter.
   *
   * @param request Authenticated request containing user context.
   * @param dto Payload containing chapter ID and status.
   * @returns Updated reading progress entity.
   */
  @Post('update')
  async updateProgress(
    @Request() request: AuthenticatedUserRequest,
    @Body() dto: UpdateProgressDto
  ): Promise<ReadingProgress> {
    return this.progressService.updateProgress(request.user.id, dto);
  }

  /**
   * Get reading activity logs for the current user.
   *
   * @param request Authenticated request containing user context.
   * @param query Query options for pagination parameters.
   * @returns Paginated result of reading event logs.
   */
  @Get('logs')
  async getMyLogs(
    @Request() request: AuthenticatedUserRequest,
    @Query() query: FindManyLogsDto
  ): Promise<PaginationResult<ReadingEventLog>> {
    return this.progressService.getEventLogs({
      pagination: {
        cursor: query.cursor,
        limit: query.limit,
        page: query.page,
      },
      userId: request.user.id,
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
