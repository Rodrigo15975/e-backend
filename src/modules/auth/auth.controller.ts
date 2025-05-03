import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { CreateAuthDto } from './dto/create-auth.dto'
import { AuthUserGuard } from './guards/auth.guard'

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name)
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() data: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, exp } = await this.authService.signIn(data)
    const isProduction = process.env.NODE_ENV === 'production'
    this.logger.debug(
      isProduction
        ? "Autenticando en modo: '" + process.env.NODE_ENV + "'"
        : "Autenticando en modo: '" + process.env.NODE_ENV + "'",
    )
    res.cookie('auth', accessToken, {
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      httpOnly: true,
    })
    res.cookie('auth_exp', exp, {
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      httpOnly: true,
    })

    res.send({
      exp,
      auth: accessToken,
      statusCode: HttpStatus.OK,
      message: 'Autenticación exitosa',
    })
  }

  @UseGuards(AuthUserGuard)
  @Delete('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    try {
      const isProduction = process.env.NODE_ENV === 'production'
      this.logger.debug(
        isProduction
          ? "Logout en modo: '" + process.env.NODE_ENV + "'"
          : "Logout en modo: '" + process.env.NODE_ENV + "'",
      )
      res.clearCookie('auth')
      res.clearCookie('auth_exp')

      res.send({
        statusCode: HttpStatus.OK,
        message: 'Logout exitoso',
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error logging out' })
    }
  }
}
