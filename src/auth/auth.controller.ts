import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @Get('logout')
  logout(@ActiveUser() user: Request['user']) {
    this.authService.logout(user.sub);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@ActiveUser() user: Request['user']) {
    const userId = user.sub;
    const refreshToken = user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
