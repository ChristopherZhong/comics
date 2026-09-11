import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserEntity } from './entities/user.entity';
import { User } from './user.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register a new user account.
   *
   * @param body Data transfer object containing registration details.
   * @returns The registered user object.
   */
  @Post('register')
  async register(
    @Body() body: RegisterDto
  ): Promise<UserEntity> {
    return this.authService.register(body.email, body.password, body.roles);
  }

  /**
   * Log in with user credentials.
   *
   * @param _body Data transfer object containing email and password credentials.
   * @param user The authenticated UserEntity extracted via decorator.
   * @returns Authentication response object with JWT access token and user info.
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() _body: LoginDto,
    @User() user: UserEntity
  ): Promise<AuthResponseDto> {
    return this.authService.login(user);
  }

  /**
   * Get profile of the current authenticated user.
   *
   * @param user The authenticated UserEntity extracted via decorator.
   * @returns The user entity of the current user.
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user: UserEntity): UserEntity {
    return user;
  }
}
