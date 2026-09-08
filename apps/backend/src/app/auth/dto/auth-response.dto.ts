import { UserEntity } from '../entities/user.entity';

export class AuthResponseDto {
  /** JWT access token */
  access_token: string;

  /** Authenticated user info */
  user: UserEntity;
}
