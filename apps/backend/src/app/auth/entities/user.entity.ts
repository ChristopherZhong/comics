import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ type: [String], description: 'Assigned roles' })
  roles: string[];

  @ApiProperty({ description: 'Primary role' })
  role: string;
}
