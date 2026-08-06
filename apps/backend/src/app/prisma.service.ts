import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private static pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL || 'postgresql://comics_user:comics_password@localhost:5432/comics_db?schema=public';
    if (!PrismaService.pool) {
      PrismaService.pool = new Pool({ connectionString });
    }
    const adapter = new PrismaPg(PrismaService.pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
