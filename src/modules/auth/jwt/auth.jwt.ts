import { Logger, Req } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { SECRETS } from 'src/common/constant/constant'
import { User } from '../types/user.type'
import { Request } from 'express'
export class AuthJwt extends PassportStrategy(Strategy, 'auth-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AuthJwt.stractJwtRequest,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: SECRETS.JWT,
      ignoreExpiration: false,
    })
  }

  private static stractJwtRequest(
    this: void,
    @Req() req: Request,
  ): string | null {
    Logger.debug({
      message: 'AuthJwt.stractJwtRequest',
      cookies: req.cookies,
    })
    return (req.cookies?.auth as string) || null
  }

  validate(payload: User) {
    return payload
  }
}
