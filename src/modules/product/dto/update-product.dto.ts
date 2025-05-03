import { PartialType } from '@nestjs/mapped-types'
import { ProductDataDto } from './create-product.dto'

export class UpdateProductDto extends PartialType(ProductDataDto) {}
