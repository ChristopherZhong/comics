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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { FindManyChaptersDto } from './dto/find-many-options.dto';
import { Chapter } from './entities/chapter.entity';
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
  @ApiResponse({ status: 201, type: Chapter })
  async create(@Body() body: CreateChapterDto) {
    return this.chapterService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Find chapters with pagination' })
  async findMany(@Query() query: FindManyChaptersDto) {
    return this.chapterService.findMany({
      comicId: query.comicId,
      pagination: {
        page: query.page,
        limit: query.limit,
        cursor: query.cursor,
      },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find chapter by ID' })
  @ApiResponse({ status: 200, type: Chapter })
  async findOne(@Param('id') id: string) {
    return this.chapterService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a chapter' })
  @ApiResponse({ status: 200, type: Chapter })
  async update(@Param('id') id: string, @Body() body: UpdateChapterDto) {
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
