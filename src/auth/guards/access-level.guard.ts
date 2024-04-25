import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ACCESS_LEVEL_KEY } from '../decorators/access-level.decorator';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { ROLES } from '../../common/enums/roles';

@Injectable()
export class AccessLevelGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = await this.verifyIfIsPublic(context);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const { user } = request;

    const accessLevel = this.reflector.getAllAndOverride<number>(
      ACCESS_LEVEL_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!user.role) {
      throw new UnauthorizedException('Invalid user');
    }

    if (!accessLevel || user.role === ROLES.ADMIN) return true;

    const userData = await this.userService.findById(user.sub);
    const userExistInProject = userData.projects?.find(
      (project) =>
        project.projectId ===
        (request.params.projectId ?? request.body.projectId),
      // request.params.projectId is a param in request
      //or also receive request.body.projectId
    );

    if (!userExistInProject) {
      throw new UnauthorizedException('You do not belong to this project');
    }

    if (accessLevel > userExistInProject.accessLevel) {
      throw new UnauthorizedException(
        `You dont have permission for this action`,
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
