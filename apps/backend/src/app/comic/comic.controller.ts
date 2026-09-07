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
import { ComicService } from './comic.service';
import { CreateComic } from './dto/create-comic.dto';
import { FindManyComicsDto } from './dto/find-many-options.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Comic } from './entities/comic.entity';

@ApiTags('comics')
@ApiBearerAuth()
@Controller('comics')
@UseGuards(JwtAuthGuard)
export class ComicController {
  constructor(private comicService: ComicService) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Create a new comic series' })
  @ApiResponse({ status: 210, type: Comic })
  async create(@Body() body: CreateComic) {
    return this.comicService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Find all comic series with pagination' })
  async findMany(@Query() query: FindManyComicsDto) {
    return this.comicService.findMany({
      pagination: {
        page: query.page,
        limit: query.limit,
        cursor: query.cursor,
      },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find comic series by ID' })
  @ApiResponse({ status: 200, type: Comic })
  async findOne(@Param('id') id: string) {
    return this.comicService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a comic series' })
  async update(@Param('id') id: string, @Body() body: Partial<CreateComic>) {
    return this.comicService.update(id, body);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comic series' })
  async remove(@Param('id') id: string) {
    return this.comicService.remove(id);
  }
}
