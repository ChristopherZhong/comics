import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
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
  @ApiResponse({ description: 'User successfully created', status: 201 })
  async register(
    @Body() body: RegisterDto
  ): Promise<Omit<UserEntity, 'roles'> & { roles: Array<{ name: string }> }> {
    return this.authService.register(body.email, body.password, body.roles);
  }

  /** Log in with credentials */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async login(@Request() request: AuthenticatedRequest): Promise<AuthResponseDto> {
    return this.authService.login(request.user);
  }

  /** Get profile of current authenticated user */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiResponse({ status: 200, type: UserEntity })
  getProfile(@Request() request: AuthenticatedRequest): UserEntity {
    return request.user;
  }
}
