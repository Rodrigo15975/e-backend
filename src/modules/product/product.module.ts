import { Module } from '@nestjs/common'
import { FilesModule } from '../files/files.module'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
  imports: [FilesModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
