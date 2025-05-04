import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PrismaService } from 'nestjs-prisma'
import { FilesService } from '../files/files.service'
import { HandleHttps } from 'src/utils/handled-https'
import { ListProductDto } from './dto/list.dto'

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    const { name, price, description, type_camera } = createProductDto.data
    const existingProduct = await this.prismaService.product.findUnique({
      where: { name },
    })

    if (existingProduct)
      throw new BadRequestException(
        `Producto con el nombre '${name}' ya existe`,
      )

    const urls = await Promise.all(
      files.map((file) => {
        return this.filesService.create({ file }, 'ecommerce')
      }),
    )

    const product = await this.prismaService.product.create({
      data: {
        name,
        price,
        description,
        type_camera,
        ProductsImgs: {
          createMany: {
            data: urls,
          },
        },
      },
    })

    return HandleHttps.ResponseOK(
      product,
      'Product creado',
      HttpStatus.CREATED,
      ProductService.name,
    )
  }

  async findAll(listProductDto: ListProductDto) {
    const { page, size } = listProductDto
    const { count, data } = await this.prismaService.$transaction(
      async (prisma) => ({
        data: await prisma.product.findMany({
          skip: (page - 1) * size,
          take: size,
          include: {
            ProductsImgs: {
              select: {
                id: true,
                key_url_unique: true,
                url: true,
              },
            },
          },
          orderBy: [{ createdAt: 'desc' }, { updatedAt: 'desc' }],
        }),
        count: await prisma.product.count(),
      }),
    )

    if (!data || data.length === 0) {
      return {
        message: 'Productos encontrados',
        data: [],
        status: HttpStatus.OK,
        count: 0,
      }
    }

    return {
      message: 'Productos encontrados',
      status: HttpStatus.OK,
      count,
      data,
    }
  }

  async findOne(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        type_camera: true,
        ProductsImgs: {
          select: {
            id: true,
            key_url_unique: true,
            url: true,
          },
        },
      },
    })
    if (!product) throw new BadRequestException('Product not found')
    return HandleHttps.ResponseOK(
      product,
      'Producto encontrado',
      HttpStatus.OK,
      ProductService.name,
    )
  }

  async update(id: string, data: UpdateProductDto) {
    if (!data) throw new BadRequestException('Data is required')
    const { name, price, description, type_camera } = data
    const existingProduct = await this.prismaService.product.findUnique({
      where: { id },
    })

    if (!existingProduct) throw new BadRequestException('Product not found')

    if (name && name !== existingProduct.name) {
      const nameTaken = await this.prismaService.product.findUnique({
        where: { name },
      })

      if (nameTaken)
        throw new ConflictException(
          `El producto con el nombre'${name}' ya existe`,
        )
    }

    const updatedProduct = await this.prismaService.product.update({
      where: { id },
      data: {
        type_camera,
        name,
        price,
        description,
      },
    })

    return HandleHttps.ResponseOK(
      updatedProduct,
      'Producto actualizado',
      HttpStatus.OK,
      ProductService.name,
    )
  }

  async uploadNewProductImg(file: Express.Multer.File, product_id: string) {
    const { url, key_url_unique } = await this.filesService.create(
      { file },
      'ecommerce',
    )
    const productImg = await this.prismaService.product.update({
      where: { id: product_id },
      data: {
        ProductsImgs: {
          create: {
            url,
            key_url_unique,
          },
        },
      },
    })
    if (!productImg)
      throw new BadRequestException('Producto con la imagen no encontrada')

    return HandleHttps.ResponseOK(
      { url },
      'Imagen subida',
      HttpStatus.OK,
      ProductService.name,
    )
  }

  async remove(product_id: string) {
    const product = await this.prismaService.product.delete({
      where: { id: product_id },
    })
    if (!product) throw new BadRequestException('Producto no encontrado')

    return HandleHttps.ResponseOK(
      product,
      'Producto eliminado',
      HttpStatus.OK,
      ProductService.name,
    )
  }
  async removeImg(id_image: string) {
    const product = await this.prismaService.productsImgs.delete({
      where: { id: id_image },
    })
    if (!product)
      throw new BadRequestException('Producto con la imagen no encontrado')
    const { key_url_unique } = product
    await this.filesService.remove(key_url_unique)
    return HandleHttps.ResponseOK(
      product,
      'Imagen del producto eliminada',
      HttpStatus.OK,
      ProductService.name,
    )
  }
}
