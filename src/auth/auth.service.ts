import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  AuthLoginReponse,
  AuthTokenResult,
  IUseToken,
} from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const userCreated = await this.usersService.create(data);
    return userCreated;
  }

  async login({ email, password }: LoginDto): Promise<AuthLoginReponse> {
    const user = await this.validateUser({ email, password });
    const token = await this.generateToken(user);

    return {
      user: email,
      accessToken: token,
    };
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

  async generateToken(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  useToken(token: string): IUseToken {
    try {
      const decodedToken = this.jwtService.decode(token) as AuthTokenResult;
      return {
        sub: decodedToken.sub,
        username: decodedToken.username,
        email: decodedToken.email,
        role: decodedToken.role,
        isExpired: decodedToken.exp <= Date.now() / 1000,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
