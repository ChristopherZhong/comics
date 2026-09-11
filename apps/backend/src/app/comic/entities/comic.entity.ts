import { PublicationStatus, ComicType } from '../../../generated/prisma/enums';

export class Comic {
  /** The unique identifier for the comic */
  id: string;

  /** Creation timestamp */
  createdAt: Date;

  /** User who created the comic */
  createdBy?: string | null;

  /** Last update timestamp */
  updatedAt: Date;

  /** User who last updated the comic */
  updatedBy?: string | null;

  /** Title of the comic */
  title: string;

  /** Detailed description of the comic */
  description?: string | null;

  /** Publisher of the comic */
  publisher?: string | null;

  /** Cover image URL */
  coverUrl?: string | null;

  /** Writer of the comic */
  writer?: string | null;

  /** Artist of the comic */
  artist?: string | null;

  /** ISO 639-1 language code (e.g. "en", "ja", "ko") */
  language?: string | null;

  /** Publication status */
  status?: PublicationStatus;

  /** Type of comic */
  type?: ComicType;
}
