import { Transform } from 'class-transformer';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { ACCESS_LEVEL } from '../../common/enums/roles';

export class AddUserInProjectDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsUUID()
  userId: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsUUID()
  projectId: string;

  @IsEnum(ACCESS_LEVEL)
  accessLevel: ACCESS_LEVEL;
}
