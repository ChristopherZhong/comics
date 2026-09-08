import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error('JWT_SECRET environment variable is missing.');
        }
        return {
          secret,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    PassportModule,
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
