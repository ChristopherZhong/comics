import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'User password', example: 'secret123' })
  password: string;

  @ApiPropertyOptional({ description: 'Role name', example: 'USER', default: 'USER' })
  role?: string;
}
