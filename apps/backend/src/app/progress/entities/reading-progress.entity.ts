import { ProgressStatus } from '../../../generated/prisma/enums';

export class ReadingProgress {
  /** The unique identifier for the reading progress */
  id: string;

  /** Creation timestamp */
  createdAt: Date;

  /** User who created the progress record */
  createdBy?: string | null;

  /** Last update timestamp */
  updatedAt: Date;

  /** User who last updated the progress record */
  updatedBy?: string | null;

  /** ID of the chapter being tracked */
  chapterId: string;

  /** ID of the user tracking progress */
  userId: string;

  /** Reading progress status */
  status: ProgressStatus;
}
