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
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ComicService } from './comic.service';
import { CreateComic } from './dto/create-comic.dto';
import { FindManyComicsDto } from './dto/find-many-options.dto';
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

  /** Create a new comic series */
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  @ApiResponse({ status: 201, type: Comic })
  async create(@Body() body: CreateComic): Promise<Comic> {
    return this.comicService.create(body);
  }

  /** Find all comic series with pagination */
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

  /** Find comic series by ID */
  @Get(':id')
  @ApiResponse({ status: 200, type: Comic })
  async findOne(@Param('id') id: string): Promise<Comic | null> {
    return this.comicService.findOne(id);
  }

  /** Update a comic series */
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<CreateComic>
  ): Promise<Comic> {
    return this.comicService.update(id, body);
  }

  /** Delete a comic series */
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Comic> {
    return this.comicService.remove(id);
  }
}
