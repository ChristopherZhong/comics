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

  /** Get current user reading progress */
  @Get()
  async getMyProgress(
    @Request() request: AuthenticatedUserRequest
  ): Promise<ReadingProgress[]> {
    return this.progressService.getUserProgress(request.user.id);
  }

  /** Update reading progress for a chapter */
  @Post('update')
  async updateProgress(
    @Request() request: AuthenticatedUserRequest,
    @Body() dto: UpdateProgressDto
  ): Promise<ReadingProgress> {
    return this.progressService.updateProgress(request.user.id, dto);
  }

  /** Get reading activity logs for current user */
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

  /** Get all reading activity logs across all users */
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
