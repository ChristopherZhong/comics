export class RegisterDto {
  /** User email address */
  email: string;

  /** User password */
  password: string;

  /** List of role names assigned to the user */
  roles?: string[];
}
