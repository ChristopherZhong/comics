import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { FindManyChaptersOptions } from './dto/find-many-options.dto';
import { transformCreateChapter } from './transformations';
import {
  CursorPaginationStrategy,
  OffsetPaginationStrategy,
  PaginationResult,
} from '../common/pagination/pagination.strategy';
import { Chapter } from './entities/chapter.entity';

@Injectable()
export class ChapterService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateChapterDto): Promise<Chapter> {
    const prismaData = transformCreateChapter(data);
    return this.prisma.chapter.create({
      data: prismaData,
    });
  }

  async findMany(
    options: FindManyChaptersOptions = {}
  ): Promise<PaginationResult<Chapter>> {
    const pagination = options.pagination || {};
    const where = options.comicId ? { comicId: options.comicId } : undefined;
    const orderBy = { chapterNumber: 'asc' };

    if (pagination.cursor) {
      const strategy = new CursorPaginationStrategy<Chapter>();
      return strategy.paginate(
        this.prisma,
        'chapter',
        pagination,
        undefined,
        where,
        orderBy
      );
    } else {
      const strategy = new OffsetPaginationStrategy<Chapter>();
      return strategy.paginate(
        this.prisma,
        'chapter',
        pagination,
        undefined,
        where,
        orderBy
      );
    }
  }

  async findOne(id: string): Promise<Chapter | null> {
    return this.prisma.chapter.findUnique({
      include: { comic: true },
      where: { id },
    });
  }

  async update(id: string, data: UpdateChapterDto): Promise<Chapter> {
    return this.prisma.chapter.update({
      data,
      where: { id },
    });
  }

  async remove(id: string): Promise<Chapter> {
    return this.prisma.chapter.delete({ where: { id } });
  }
}
