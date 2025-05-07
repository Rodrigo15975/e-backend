import { Transform } from 'class-transformer'
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateClientDto {
  @IsString()
  @IsOptional()
  id: string

  @IsNotEmpty()
  @IsString()
  dni: string

  @IsNotEmpty()
  @IsString()
  phone: string

  @IsNotEmpty()
  @IsString()
  stado: string

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  details_service: string

  @IsOptional()
  @IsDateString()
  createdAt: Date | string

  @IsOptional()
  @IsDateString()
  updatedAt: Date | string
}
