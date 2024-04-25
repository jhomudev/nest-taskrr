import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  // @IsEmail-> no this, cause can use email and username for login
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  password: string;
}
