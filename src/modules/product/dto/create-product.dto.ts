import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  ValidateNested,
  IsOptional,
} from 'class-validator'
import { Type } from 'class-transformer'

export class ProductDataDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description: string

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
