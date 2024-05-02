import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthLoginReponse } from './interfaces/auth.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(data: RegisterDto) {
    data.password = await this.hashData(data.password);
    const userCreated = await this.usersService.create(data);
    return userCreated;
  }

  async login({ email, password }: LoginDto): Promise<AuthLoginReponse> {
    const user = await this.validateUser({ email, password });
    const { accessToken, refreshToken } = await this.generateTokens(user);

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      user: email,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    const { affected } = await this.usersService.update(
      { refreshToken: null },
      userId,
    );
    return affected > 0
      ? {
          message: 'Logout success',
        }
      : {
          message: 'Logout failed',
        };
  }

  hashData(data: string, salt = 10) {
    return bcrypt.hash(data, salt);
  }

  async validateUser({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Credentials not found');
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Incorrect password');
    }
    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(
      {
        refreshToken: hashedRefreshToken,
      },
      userId,
    );
  }

  async generateTokens(userData: User) {
    const payloadToken = {
      sub: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payloadToken, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payloadToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findByIdWithRefreshTooken(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
