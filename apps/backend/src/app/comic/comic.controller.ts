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
import { ComicService } from './comic.service';
import { CreateComic } from './dto/create-comic.dto';
import { FindManyComicsDto } from './dto/find-many-options.dto';
import { FindByIdDto } from '../common/dto/find-by-id.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Comic } from './entities/comic.entity';
import { PaginationResult } from '../common/pagination/pagination.strategy';

@ApiTags('comics')
@ApiBearerAuth()
@Controller('comics')
@UseGuards(JwtAuthGuard)
export class ComicController {
  constructor(private comicService: ComicService) {}

  /**
   * Create a new comic series.
   *
   * @param body Data transfer object for creating a comic.
   * @returns The created comic entity.
   */
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() body: CreateComic): Promise<Comic> {
    return this.comicService.create(body);
  }

  /**
   * Find all comic series with offset or cursor pagination.
   *
   * @param query Query options containing page, limit, or cursor.
   * @returns Paginated result of comic entities.
   */
  @Get()
  async findMany(
    @Query() query: FindManyComicsDto
  ): Promise<PaginationResult<Comic>> {
    return this.comicService.findMany({
      pagination: {
        cursor: query.cursor,
        limit: query.limit,
        page: query.page,
      },
    });
  }

  /**
   * Find comic series by ID.
   *
   * @param params Parameter DTO containing unique identifier of the comic.
   * @returns The comic entity or null if not found.
   */
  @Get(':id')
  async findOne(@Param() params: FindByIdDto): Promise<Comic | null> {
    return this.comicService.findOne(params.id);
  }

  /**
   * Update an existing comic series.
   *
   * @param params Parameter DTO containing unique identifier of the comic.
   * @param body Partial comic data to update.
   * @returns Updated comic entity.
   */
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Param() params: FindByIdDto,
    @Body() body: Partial<CreateComic>
  ): Promise<Comic> {
    return this.comicService.update(params.id, body);
  }

  /**
   * Delete a comic series.
   *
   * @param params Parameter DTO containing unique identifier of the comic.
   * @returns Deleted comic entity.
   */
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param() params: FindByIdDto): Promise<Comic> {
    return this.comicService.remove(params.id);
  }
}
