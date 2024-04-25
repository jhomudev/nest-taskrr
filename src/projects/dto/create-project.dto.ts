import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50)
  name: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(300)
  description: string;
}
