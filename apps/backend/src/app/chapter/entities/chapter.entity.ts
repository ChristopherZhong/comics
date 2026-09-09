export class Chapter {
  /** The unique identifier for the chapter */
  id: string;

  /** Creation timestamp */
  createdAt: Date;

  /** User who created the chapter */
  createdBy?: string | null;

  /** Last update timestamp */
  updatedAt: Date;

  /** User who last updated the chapter */
  updatedBy?: string | null;

  /** ID of the comic series this chapter belongs to */
  comicId: string;

  /** Title of the chapter */
  title: string;

  /** Chapter number */
  chapterNumber: number;

  /** Total number of pages in the chapter */
  pagesCount: number;

  /** List of scanlation group IDs translating this chapter */
  scanlationGroupIds?: string[];
}
