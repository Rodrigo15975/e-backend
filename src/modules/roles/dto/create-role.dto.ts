import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { TypeRole } from 'src/common/decorators/role.decorator'

export class CreateRoleDto {
  @IsOptional()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.toUpperCase().trim())
  name: TypeRole

  @IsOptional()
  @IsString()
  updatedAt?: string | Date

  @IsOptional()
  @IsString()
  createdAt?: string | Date
}
