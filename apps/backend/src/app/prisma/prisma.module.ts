import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PaginationStrategyRegistry } from '../common/pagination/pagination.strategy';

@Global()
@Module({
  exports: [PaginationStrategyRegistry, PrismaService],
  providers: [PaginationStrategyRegistry, PrismaService],
})
export class PrismaModule {}
