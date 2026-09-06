import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get()
  async getMyProgress(@Request() req: any) {
    return this.progressService.getUserProgress(req.user.userId);
  }

  @Post('update')
  async updateProgress(
    @Request() req: any,
    @Body('chapterId') chapterId: string,
    @Body('status') status: any
  ) {
    return this.progressService.updateProgress(req.user.userId, chapterId, status);
  }

  @Get('logs')
  async getMyLogs(
    @Request() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20
  ) {
    return this.progressService.getEventLogs(req.user.userId, page, limit);
  }

  @Get('logs/all')
  async getAllLogs(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.progressService.getEventLogs(undefined, page, limit);
  }
}
