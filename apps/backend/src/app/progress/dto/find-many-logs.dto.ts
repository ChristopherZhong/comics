import { FindManyOptions, PaginationOptions } from '../../comic/dto/find-many-options.dto';

export class FindManyLogsDto implements PaginationOptions {
  /** Page number for offset pagination */
  page?: number;

  /** Number of items per page */
  limit?: number;

  /** Cursor ID for cursor pagination */
  cursor?: string;
}

export interface FindManyLogsOptions extends FindManyOptions {
  userId?: string;
}
