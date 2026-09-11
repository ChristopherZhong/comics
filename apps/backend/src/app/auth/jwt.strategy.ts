import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

interface JwtPayload {
  sub: string;
  email: string;
  roles?: string[];
  role?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException('JWT_SECRET environment variable is missing.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const rolesList = payload.roles || (payload.role ? [payload.role] : []);
    return {
      email: payload.email,
      id: payload.sub,
      roles: rolesList,
    };
  }
}
