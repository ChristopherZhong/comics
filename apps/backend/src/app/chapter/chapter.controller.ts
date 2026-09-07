import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChapterService } from './chapter.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('chapters')
@ApiBearerAuth()
@Controller('chapters')
@UseGuards(JwtAuthGuard)
export class ChapterController {
  constructor(private chapterService: ChapterService) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Create a new chapter' })
  async create(@Body() body: any) {
    return this.chapterService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Find chapters' })
  async findMany(
    @Query('comicId') comicId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20
  ) {
    return this.chapterService.findMany(comicId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find chapter by ID' })
  async findOne(@Param('id') id: string) {
    return this.chapterService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a chapter' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.chapterService.update(id, body);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chapter' })
  async remove(@Param('id') id: string) {
    return this.chapterService.remove(id);
  }
}
