import { PartialType, PickType } from '@nestjs/swagger';
import { Comic } from '../entities/comic.entity';

export class CreateComicBase extends PickType(Comic, ['title'] as const) {}

export class CreateComicOptional extends PartialType(
  PickType(Comic, [
    'artist',
    'coverUrl',
    'description',
    'language',
    'publisher',
    'status',
    'type',
    'writer',
  ] as const)
) {}

export class CreateComic extends CreateComicBase {
  /** Detailed description of the comic */
  override description?: string;

  /** Publisher of the comic */
  override publisher?: string;

  /** Cover image URL */
  override coverUrl?: string;

  /** Writer of the comic */
  override writer?: string;

  /** Artist of the comic */
  override artist?: string;

  /** ISO 639-1 language code (e.g. "en", "ja", "ko") */
  override language?: string;

  /** List of Scanlation Group IDs translating this comic */
  scanlationGroupIds?: string[];
}
