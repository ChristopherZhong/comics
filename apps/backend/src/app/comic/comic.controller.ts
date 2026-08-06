import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ComicService } from './comic.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('comics')
export class ComicController {
  constructor(private comicService: ComicService) {}

  @Get()
  async getAllComics() {
    return this.comicService.getAllComics();
  }

  @Get(':id')
  async getComicById(@Param('id', ParseIntPipe) id: number) {
    return this.comicService.getComicById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async createComic(@Body() body: any) {
    return this.comicService.createComic(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':id/chapters')
  async addChapter(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any
  ) {
    return this.comicService.addChapter(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteComic(@Param('id', ParseIntPipe) id: number) {
    return this.comicService.deleteComic(id);
  }
}
