import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateAuthDto } from './dto/create-auth.dto'
import { verifyPassword } from 'src/common/encrypt/argon2'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'nestjs-prisma'
import { User } from './types/user.type'
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(data: CreateAuthDto) {
    const { username, password } = data
    const user = await this.prismaService.user.findUnique({
      where: { username },
      select: {
        role: true,
        password: true,
        username: true,
        id: true,
      },
    })
    if (!user) throw new BadRequestException('Credenciales incorrectas')
    const isPasswordValid = await verifyPassword(user.password, password)
    if (!isPasswordValid)
      throw new BadRequestException('Credenciales incorrectas')
    const { id: user_id, username: nameToken, role } = user
    return await this.getToken({
      user_id,
      name: nameToken,
      role,
    })
  }
  private getExpirationToken(token: string) {
    return this.jwtService.decode<User>(token)
  }
  private async getToken(user: User) {
    const { user_id } = user
    const payload = { user_id }
    const accessToken = await this.jwtService.signAsync(payload)
    const decoded = this.getExpirationToken(accessToken)
    const { exp } = decoded

    return { accessToken, exp }
  }
}
