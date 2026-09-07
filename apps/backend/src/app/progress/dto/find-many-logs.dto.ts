import { ApiPropertyOptional } from '@nestjs/swagger';
import { FindManyOptions, PaginationOptions } from '../../comic/dto/find-many-options.dto';

export class FindManyLogsDto implements PaginationOptions {
  @ApiPropertyOptional({ description: 'Page number for offset pagination', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 20 })
  limit?: number;

  @ApiPropertyOptional({ description: 'Cursor ID for cursor pagination' })
  cursor?: string;
}

export interface FindManyLogsOptions extends FindManyOptions {
  userId?: string;
}
