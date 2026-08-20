import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
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
  async getMyLogs(@Request() req: any) {
    return this.progressService.getEventLogs(req.user.userId);
  }

  @Get('logs/all')
  async getAllLogs() {
    return this.progressService.getEventLogs();
  }
}
