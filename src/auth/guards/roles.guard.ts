import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES } from '../../common/enums/roles';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = await this.verifyIfIsPublic(context);
    if (isPublic) return true;

    const roles = this.reflector.getAllAndOverride<ROLES>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();

    const { user } = request;

    if (!user.role) {
      throw new UnauthorizedException('Invalid user');
    }

    if (!roles || user.role === ROLES.ADMIN) return true;
    if (!roles.includes(user.role)) {
      throw new UnauthorizedException(
        'You dont have permission for this action',
      );
    }

    return true;
  }
  async verifyIfIsPublic(context: ExecutionContext) {
    const isPublic: boolean = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    return isPublic;
  }
}
