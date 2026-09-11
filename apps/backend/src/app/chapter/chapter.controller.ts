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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { FindManyChaptersDto } from './dto/find-many-options.dto';
import { Chapter } from './entities/chapter.entity';
import { PaginationResult } from '../common/pagination/pagination.strategy';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('chapters')
@ApiBearerAuth()
@Controller('chapters')
@UseGuards(JwtAuthGuard)
export class ChapterController {
  constructor(private chapterService: ChapterService) {}

  /** Create a new chapter */
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() body: CreateChapterDto): Promise<Chapter> {
    return this.chapterService.create(body);
  }

  /** Find chapters with pagination */
  @Get()
  async findMany(
    @Query() query: FindManyChaptersDto
  ): Promise<PaginationResult<Chapter>> {
    return this.chapterService.findMany({
      comicId: query.comicId,
      pagination: {
        cursor: query.cursor,
        limit: query.limit,
        page: query.page,
      },
    });
  }

  /** Find chapter by ID */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Chapter | null> {
    return this.chapterService.findOne(id);
  }

  /** Update a chapter */
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateChapterDto
  ): Promise<Chapter> {
    return this.chapterService.update(id, body);
  }

  /** Delete a chapter */
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Chapter> {
    return this.chapterService.remove(id);
  }
}
