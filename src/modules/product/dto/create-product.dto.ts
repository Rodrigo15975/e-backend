import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  ValidateNested,
  IsOptional,
} from 'class-validator'
import { Transform, Type } from 'class-transformer'

export class ProductDataDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  name: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  description: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  type_camera: string

  @IsNotEmpty()
  @IsNumber()
  price: number

  @IsOptional()
  @IsDateString()
  createdAt: Date | string

  @IsOptional()
  @IsDateString()
  updatedAt: Date | string
}

export class CreateProductDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ProductDataDto)
  data: ProductDataDto
}
