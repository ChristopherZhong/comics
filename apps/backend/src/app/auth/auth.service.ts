import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';

interface UserWithRoles {
  id: string;
  email: string;
  password?: string;
  roles: Array<{ name: string }>;
}

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
   * @returns User object without password if valid, or null if invalid.
   */
  async validateUser(
    email: string,
    pass: string
  ): Promise<Omit<UserWithRoles, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });
    if (user && (await bcrypt.compare(pass, user.password))) {
      return {
        id: user.id,
        email: user.email,
        roles: user.roles,
      };
    }
    return null;
  }

  /**
   * Generate JWT access token for an authenticated user.
   *
   * @param user Authenticated user record with roles.
   * @returns Access token object and user entity.
   */
  async login(user: UserWithRoles): Promise<{ access_token: string; user: UserEntity }> {
    const rolesList = user.roles.map((roleObject) => roleObject.name);
    const payload = {
      email: user.email,
      roles: rolesList,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        id: user.id,
        roles: rolesList,
      },
    };
  }

  /**
   * Register a new user with encrypted password and assigned roles.
   *
   * @param email User email address.
   * @param pass Plaintext password.
   * @param rolesList List of role names to assign.
   * @returns Newly created user record without password.
   */
  async register(
    email: string,
    pass: string,
    rolesList: string[] = ['USER']
  ): Promise<Omit<UserWithRoles, 'password'>> {
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
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
  }
}
