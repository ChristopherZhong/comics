import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  /**
   * Validate user credentials against stored password hash.
   *
   * @param email Email address of the user.
   * @param pass Plaintext password to verify.
   * @returns Validated UserEntity without password if credentials match, or null.
   */
  async validateUser(
    email: string,
    pass: string
  ): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      include: { roles: true },
      where: { email },
    });
    if (user && (await bcrypt.compare(pass, user.password))) {
      return {
        email: user.email,
        id: user.id,
        roles: user.roles.map((role) => role.name),
      };
    }
    return null;
  }

  /**
   * Generate JWT access token for an authenticated user entity.
   *
   * @param user Authenticated UserEntity record.
   * @returns Access token object and user entity.
   */
  async login(user: UserEntity): Promise<{ access_token: string; user: UserEntity }> {
    const payload = {
      email: user.email,
      roles: user.roles,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  /**
   * Register a new user with encrypted password and assigned roles.
   *
   * @param email User email address.
   * @param pass Plaintext password.
   * @param rolesList List of role names to assign.
   * @returns Newly created UserEntity.
   */
  async register(
    email: string,
    pass: string,
    rolesList: string[] = ['USER']
  ): Promise<UserEntity> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }

    const roleConnections = await Promise.all(
      rolesList.map(async (roleName) => {
        let role = await this.prisma.role.findUnique({ where: { name: roleName } });
        if (!role) {
          role = await this.prisma.role.create({ data: { name: roleName } });
        }
        return { id: role.id };
      })
    );

    const hashedPassword = await bcrypt.hash(pass, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roles: {
          connect: roleConnections,
        },
      },
      include: { roles: true },
    });

    return {
      email: user.email,
      id: user.id,
      roles: user.roles.map((role) => role.name),
    };
  }
}
