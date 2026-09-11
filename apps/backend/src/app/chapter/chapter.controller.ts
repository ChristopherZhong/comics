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
import { FindByIdDto } from '../common/dto/find-by-id.dto';
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

  /**
   * Create a new chapter.
   *
   * @param body Payload containing chapter details and optional scanlation groups.
   * @returns Newly created chapter entity.
   */
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() body: CreateChapterDto): Promise<Chapter> {
    return this.chapterService.create(body);
  }

  /**
   * Find chapters with offset or cursor pagination.
   *
   * @param query Query parameters for filtering by comic ID and pagination.
   * @returns Paginated result of chapters.
   */
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

  /**
   * Find a chapter by ID.
   *
   * @param params Parameter DTO containing unique identifier of the chapter.
   * @returns Chapter entity or null if not found.
   */
  @Get(':id')
  async findOne(@Param() params: FindByIdDto): Promise<Chapter | null> {
    return this.chapterService.findOne(params.id);
  }

  /**
   * Update an existing chapter.
   *
   * @param params Parameter DTO containing unique identifier of the chapter to update.
   * @param body Update chapter payload.
   * @returns Updated chapter entity.
   */
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Param() params: FindByIdDto,
    @Body() body: UpdateChapterDto
  ): Promise<Chapter> {
    return this.chapterService.update(params.id, body);
  }

  /**
   * Delete a chapter by ID.
   *
   * @param params Parameter DTO containing unique identifier of the chapter to remove.
   * @returns Deleted chapter entity.
   */
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param() params: FindByIdDto): Promise<Chapter> {
    return this.chapterService.remove(params.id);
  }
}
