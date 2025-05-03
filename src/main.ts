import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { InitialApp } from './config/initial-app'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await InitialApp(app)
}
bootstrap()
