import { CustomDecorator, SetMetadata } from '@nestjs/common';

/**
 * Set metadata specifying roles allowed to access an endpoint.
 *
 * @param roles Array of role names permitted to access the resource.
 * @returns NestJS CustomDecorator function attaching roles metadata.
 */
export function Roles(...roles: string[]): CustomDecorator<string> {
  return SetMetadata('roles', roles);
}
