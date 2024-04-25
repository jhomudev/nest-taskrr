import { SetMetadata } from '@nestjs/common';
import { ACCESS_LEVEL } from '../../common/enums/roles';

export const ACCESS_LEVEL_KEY = 'access_level';
export const AccessLevel = (level: ACCESS_LEVEL) =>
  SetMetadata(ACCESS_LEVEL_KEY, level);
