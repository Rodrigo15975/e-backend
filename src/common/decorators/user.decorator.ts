import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common'
import { Request } from 'express'

export const GetUserPayloadToken = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>()
    Logger.debug({
      message: 'GetToken',
      token: request.cookies.auth as string,
    })
    Logger.debug({
      message: 'PayloadUser',
      user: request.user,
    })
    return request.user
  },
)
