import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsUUID,
  IsOptional,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly password?: string;

  @IsUUID()
  @IsNotEmpty()
  readonly roleId: string;
}
