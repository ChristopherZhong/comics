import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserEntity } from './entities/user.entity';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

interface AuthenticatedRequest {
  user: UserEntity & { roles: Array<{ name: string }> };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /** Register a new user */
  @Post('register')
  async register(
    @Body() body: RegisterDto
  ): Promise<Omit<UserEntity, 'roles'> & { roles: Array<{ name: string }> }> {
    return this.authService.register(body.email, body.password, body.roles);
  }

  /** Log in with credentials */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() _body: LoginDto,
    @Request() request: AuthenticatedRequest
  ): Promise<AuthResponseDto> {
    return this.authService.login(request.user);
  }

  /** Get profile of current authenticated user */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() request: AuthenticatedRequest): UserEntity {
    return request.user;
  }
}
