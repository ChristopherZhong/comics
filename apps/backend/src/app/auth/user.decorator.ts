import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

/**
 * Custom parameter decorator to extract authenticated user from the HTTP request context.
 */
export const User = createParamDecorator(
  (data: keyof UserEntity | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserEntity;

    return data && user ? user[data] : user;
  }
);
