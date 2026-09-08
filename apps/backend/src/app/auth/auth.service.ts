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
