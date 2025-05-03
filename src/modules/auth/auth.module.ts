import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { SECRETS } from 'src/common/constant/constant'
import { AuthJwt } from './jwt/auth.jwt'
@Module({
  imports: [
    JwtModule.register({
      secret: SECRETS.JWT,
      signOptions: { expiresIn: SECRETS.EXP },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthJwt],
})
export class AuthModule {}
