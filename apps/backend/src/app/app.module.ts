import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { ComicModule } from './comic/comic.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [PrismaModule, AuthModule, ComicModule, ProgressModule],
})
export class AppModule {}
