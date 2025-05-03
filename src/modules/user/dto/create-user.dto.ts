import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @IsOptional()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  firstName: string

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  username: string

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  lastName: string

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  password: string

  @IsNotEmpty()
  @IsString()
  id_role: string

  @IsOptional()
  @IsString()
  updatedAt?: string | Date

  @IsOptional()
  @IsString()
  createdAt?: string | Date
}
