import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'nestjs-prisma'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { RolesModule } from './modules/roles/roles.module'
import { ProductModule } from './modules/product/product.module'
import { FilesModule } from './modules/files/files.module'
import { ClientModule } from './modules/client/client.module'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    RolesModule,
    ProductModule,
    FilesModule,
    ClientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
