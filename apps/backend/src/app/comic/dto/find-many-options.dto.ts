import { ApiPropertyOptional } from '@nestjs/swagger';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface FindManyOptions {
  pagination?: PaginationOptions;
}

export class FindManyComicsDto implements PaginationOptions {
  @ApiPropertyOptional({ description: 'Page number for offset pagination', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 20 })
  limit?: number;

  @ApiPropertyOptional({ description: 'Cursor ID for cursor pagination' })
  cursor?: string;
}
