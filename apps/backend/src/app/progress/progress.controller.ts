import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { FindManyLogsDto } from './dto/find-many-logs.dto';
import { ReadingProgress } from './entities/reading-progress.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('progress')
@ApiBearerAuth()
@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user reading progress' })
  @ApiResponse({ status: 200, type: [ReadingProgress] })
  async getMyProgress(@Request() req: any) {
    return this.progressService.getUserProgress(req.user.userId);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update reading progress for a chapter' })
  @ApiResponse({ status: 200, type: ReadingProgress })
  async updateProgress(
    @Request() req: any,
    @Body() dto: UpdateProgressDto
  ) {
    return this.progressService.updateProgress(req.user.userId, dto);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get reading activity logs for current user' })
  async getMyLogs(
    @Request() req: any,
    @Query() query: FindManyLogsDto
  ) {
    return this.progressService.getEventLogs({
      userId: req.user.userId,
      pagination: {
        page: query.page,
        limit: query.limit,
        cursor: query.cursor,
      },
    });
  }

  @Get('logs/all')
  @ApiOperation({ summary: 'Get all reading activity logs across all users' })
  async getAllLogs(@Query() query: FindManyLogsDto) {
    return this.progressService.getEventLogs({
      pagination: {
        page: query.page,
        limit: query.limit,
        cursor: query.cursor,
      },
    });
  }
}
