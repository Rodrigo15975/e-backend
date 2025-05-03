import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  username: string

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  password: string
}
