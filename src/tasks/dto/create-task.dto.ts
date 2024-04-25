import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { STATUS_TASK } from '../enums/status-task';

export class CreateTaskDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(5)
  @IsNotEmpty()
  name: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(10)
  @IsNotEmpty()
  description: string;

  @IsEnum(STATUS_TASK)
  @IsOptional()
  status: STATUS_TASK;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  responsableId: string;
}
