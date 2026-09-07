import { PublicationStatus, ComicType } from '../../../generated/prisma/enums';

export class Comic {
  id: string;
  createdAt: Date;
  createdBy?: string | null;
  updatedAt: Date;
  updatedBy?: string | null;

  title: string;
  description?: string | null;
  publisher?: string | null;
  coverUrl?: string | null;
  writer?: string | null;
  artist?: string | null;
  language?: string | null;
  status?: PublicationStatus;
  type?: ComicType;
}

export class CreateComic {
  title: string;
  description?: string;
  publisher?: string;
  coverUrl?: string;
  writer?: string;
  artist?: string;
  language?: string;
  status?: PublicationStatus;
  type?: ComicType;
  scanlationGroupIds?: string[];
}
