import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Permission } from '../enums/permission.enum';
export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  readonly name: string;

  @IsEnum(Permission, { each: true })
  @IsNotEmpty()
  readonly permissions: Permission[];
}
