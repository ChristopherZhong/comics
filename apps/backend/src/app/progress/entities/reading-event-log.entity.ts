import { ProgressStatus } from '../../../generated/prisma/enums';

export class ReadingEventLog {
  /** The unique identifier for the reading event log */
  id: string;

  /** Creation timestamp */
  createdAt: Date;

  /** User who created the log */
  createdBy?: string | null;

  /** Last update timestamp */
  updatedAt: Date;

  /** User who last updated the log */
  updatedBy?: string | null;

  /** ID of the chapter */
  chapterId: string;

  /** ID of the user */
  userId: string;

  /** Progress status recorded in log */
  status: ProgressStatus;

  /** Timestamp of the event */
  timestamp: Date;
}
