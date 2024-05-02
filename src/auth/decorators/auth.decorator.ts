import { UseGuards, applyDecorators } from '@nestjs/common';
import { ACCESS_LEVEL, ROLES } from '../../common/enums/roles';
import { AccessLevelGuard } from '../guards/access-level.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AccessLevel } from './access-level.decorator';
import { Roles } from './roles.decorator';

export interface IAuthDecorator {
  roles?: ROLES[];
  accessLevel?: ACCESS_LEVEL;
}

export function Auth({ accessLevel, roles = [ROLES.BASIC] }: IAuthDecorator) {
  return applyDecorators(
    Roles(...roles),
    AccessLevel(accessLevel),
    UseGuards(RolesGuard, AccessLevelGuard),
  );
}
