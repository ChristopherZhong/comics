import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class RegisterDto extends PickType(UserEntity, ['email'] as const) {
  /** User password */
  password: string;

  /** List of role names assigned to the user */
  override roles?: string[];
}
