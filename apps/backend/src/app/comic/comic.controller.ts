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
import { ComicService } from './comic.service';
import { CreateComic } from './dto/create-comic.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('comics')
@UseGuards(JwtAuthGuard)
export class ComicController {
  constructor(private comicService: ComicService) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() body: CreateComic) {
    return this.comicService.create(body);
  }

  @Get()
  async findMany(
    @Query('page') page?: number,
    @Query('limit') limit = 20,
    @Query('cursor') cursor?: string
  ) {
    return this.comicService.findMany({ page, limit, cursor });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.comicService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<CreateComic>) {
    return this.comicService.update(id, body);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.comicService.remove(id);
  }
}
