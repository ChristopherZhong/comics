import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('chapters')
@UseGuards(JwtAuthGuard)
export class ChapterController {
  constructor(private chapterService: ChapterService) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() body: any) {
    return this.chapterService.create(body);
  }

  @Get()
  async findMany(
    @Query('comicId') comicId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20
  ) {
    return this.chapterService.findMany(comicId, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.chapterService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.chapterService.update(id, body);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.chapterService.remove(id);
  }
}
