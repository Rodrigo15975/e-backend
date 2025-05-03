import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as path from 'path'
import { v4 as uuidV4 } from 'uuid'
import { CreateFileDto } from './dto/create-file.dto'
@Injectable()
export class FilesService {
  private readonly logger: Logger = new Logger(FilesService.name)
  private readonly bucketName: string = ''
  constructor(
    private readonly configService: ConfigService,
    private readonly S3: S3Client,
  ) {
    this.bucketName = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
  }
  async create(createFileDto: CreateFileDto, name: string) {
    if (!name)
      throw new BadRequestException({
        message: "Name doesn't exist",
        cause: name,
        status: HttpStatus.BAD_REQUEST,
      })
    try {
      const { file: image } = createFileDto
      const typeFile = path.extname(image.originalname)
      const baseName = image.originalname.replace(typeFile, '')
      const sanitizedBaseName = baseName
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-_]/g, '')

      const Key = `${name}/${uuidV4()}-${sanitizedBaseName}${typeFile}`

      const command = this.createCommand(image, Key)
      await this.S3.send(command)
      const url = `https://${this.bucketName}.s3.amazonaws.com/${Key}`

      return { url, key_url_unique: Key }
    } catch (error) {
      this.logger.error(error)
      throw new HttpException(
        'Error to upload file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  private createCommand(file: Express.Multer.File, Key: string) {
    return new PutObjectCommand({
      Bucket: this.bucketName,
      Key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
      Metadata: {
        'Content-Disposition': `attachment; filename="${file.originalname}"`,
        'Content-Type': file.mimetype,
      },
    })
  }
  private deleteCommand(Key: string) {
    return new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key,
    })
  }

  async remove(key: string) {
    try {
      const commandDelete = this.deleteCommand(key)
      await this.S3.send(commandDelete)
    } catch (error) {
      this.logger.error(error, error, {
        message: 'Error to be delete command file-remove',
        service: FilesService.name,
      })
      throw new HttpException(
        'Error to delete file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
