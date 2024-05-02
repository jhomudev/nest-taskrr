import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ROLES } from '../../common/enums/roles';

export class RegisterDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  lastName: string;

  @IsNumber()
  age: number;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsEmail()
  email: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  username: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  password: string;

  @IsEnum(ROLES)
  @IsOptional()
  role: ROLES;

  refreshToken: string;
}
