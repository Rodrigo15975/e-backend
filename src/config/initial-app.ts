import { INestApplication, Logger, ValidationPipe } from '@nestjs/common'
import * as cookie from 'cookie-parser'
export const InitialApp = async (app: INestApplication<any>) => {
  Logger.debug('Initial Cookie Parser')
  app.use(cookie())
  Logger.debug('Cookie Parser Initialized')

  app.useLogger(
    process.env.NODE_ENV === 'production'
      ? ['error', 'warn', 'log']
      : ['log', 'error', 'warn', 'debug', 'verbose'],
  )
  Logger.debug(
    "Configuration enable cors with origin 'true' and credentials 'true' .....",
  )
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
  Logger.debug('Enable cors Initialized !!!')

  const PORT = Number(process.env.PORT) ?? 4000
  app.setGlobalPrefix('api-v1')
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  await app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development')
      return Logger.verbose(
        `Listening on port ${PORT}, in development mode: ${process.env.NODE_ENV}`,
      )
    Logger.log(
      `Listening on port ${PORT}, in production mode: ${process.env.NODE_ENV}`,
    )
  })
}
