import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common'
import { ProductService } from './product.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 2))
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('data') createProductDto: string,
  ) {
    const parsedDto = JSON.parse(createProductDto) as CreateProductDto['data']
    const dataDto: CreateProductDto = {
      data: parsedDto,
    }
    return this.productService.create(dataDto, files)
  }

  @Get()
  findAll() {
    return this.productService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() { data }: UpdateProductDto) {
    return this.productService.update(id, { data })
  }

  @Post('upload-img/:product_id')
  @UseInterceptors(FileInterceptor('image'))
  uploadNewProductImg(
    @UploadedFile() file: Express.Multer.File,
    @Param('product_id') product_id: string,
  ) {
    return this.productService.uploadNewProductImg(file, product_id)
  }

  @Delete(':product_id')
  remove(@Param('product_id') id: string) {
    return this.productService.remove(id)
  }

  @Delete('delete-img/:id_image')
  removeImg(@Param('id_image') id_image: string) {
    return this.productService.removeImg(id_image)
  }
}
