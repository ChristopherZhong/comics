export interface PaginationOptions {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface FindManyOptions {
  pagination?: PaginationOptions;
}

export class FindManyComicsDto implements PaginationOptions {
  /** Page number for offset pagination */
  page?: number;

  /** Number of items per page */
  limit?: number;

  /** Cursor ID for cursor pagination */
  cursor?: string;
}
