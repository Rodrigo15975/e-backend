import { Module } from '@nestjs/common'
import { FilesService } from './files.service'
import { S3Client } from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'

@Module({
  controllers: [],
  providers: [
    FilesService,
    {
      provide: S3Client,
      useFactory: (configService: ConfigService) =>
        new S3Client({
          region: configService.getOrThrow('S3_REGION'),
          credentials: {
            secretAccessKey: configService.getOrThrow('S3_SECRET_ACCESS_KEY'),
            accessKeyId: configService.getOrThrow('S3_ACCESS_KEY'),
          },
        }),
      inject: [ConfigService],
    },
  ],
  exports: [FilesService, S3Client],
})
export class FilesModule {}
