import { FindManyOptions, PaginationOptions } from '../../comic/dto/find-many-options.dto';

export class FindManyChaptersDto implements PaginationOptions {
  /** Filter chapters by comic ID */
  comicId?: string;

  /** Page number for offset pagination */
  page?: number;

  /** Number of items per page */
  limit?: number;

  /** Cursor ID for cursor pagination */
  cursor?: string;
}

export interface FindManyChaptersOptions extends FindManyOptions {
  comicId?: string;
}
