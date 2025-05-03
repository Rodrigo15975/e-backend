import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator'

export class ListUserDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  page: number = 1

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  size: number = 25
}
