import { HttpStatus } from '@nestjs/common'

export class HandleHttps {
  static ResponseOK<T>(
    data: T,
    message: string,
    statusCode: HttpStatus,
    service?: string,
  ) {
    return {
      message,
      statusCode,
      service,
      data,
      timestamp: new Date().toISOString(),
    }
  }
}
