import { Transform } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'

export class ListProductDto {
  @IsOptional()
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
