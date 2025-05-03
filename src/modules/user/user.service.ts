import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { CreateUserDto } from './dto/create-user.dto'
import { hashPassword } from 'src/common/encrypt/argon2'
import { ListUserDto } from './dto/list-user.dto'

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name)
  constructor(private readonly prismaService: PrismaService) {}

  async createOrUpdate(createUserDto: CreateUserDto, id_user?: string) {
    const { firstName, password, id_role, lastName, username } = createUserDto
    this.logger.debug(id_user ? 'User actualizando' : 'User creando')
    let passwordHash: string = ''
    await this.verifyUser(username, id_user)
    if (!id_user) passwordHash = await hashPassword(password)

    const user = await this.prismaService.user.upsert({
      create: {
        firstName,
        lastName,
        username,
        password: passwordHash,
        role: {
          connect: {
            id: id_role,
          },
        },
      },
      update: {
        firstName,
        lastName,
        username,
        role: {
          connect: {
            id: id_role,
          },
        },
      },
      where: {
        id: id_user || '',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        role: true,
        password: false,
      },
    })
    return {
      user,
      status: id_user ? HttpStatus.OK : HttpStatus.CREATED,
      message: id_user ? 'User actualizado' : 'User creado',
    }
  }

  async findOne(user_id: string) {
    if (!user_id) throw new BadRequestException('User ID no proporcionado')
    return await this.prismaService.user.findUnique({
      where: { id: user_id },
      include: { role: true },
      omit: { password: true, roleId: true },
    })
  }

  async list(listUserDto: ListUserDto) {
    const { page, size } = listUserDto
    const { count, data } = await this.prismaService.$transaction(
      async (prisma) => ({
        data: await prisma.user.findMany({
          skip: (page - 1) * size,
          take: size,
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: [{ createdAt: 'desc' }, { updatedAt: 'desc' }],
          omit: {
            roleId: true,
            password: true,
          },
        }),
        count: await prisma.user.count(),
      }),
    )

    if (!data || data.length === 0)
      return {
        status: HttpStatus.OK,
        count: 0,
        data,
      }
    return {
      status: HttpStatus.OK,
      count,
      data,
    }
  }

  private async verifyUser(username: string, id_user?: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    })

    if (user && user.id !== id_user)
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: `El nombre  ${username}  ya está en uso.`,
      })
  }

  async remove(id: string) {
    const user = await this.prismaService.user.delete({ where: { id } })
    if (!user) throw new BadRequestException('Usuario no encontrado')
    return {
      user,
      status: HttpStatus.OK,
      message: 'Usuario eliminado',
    }
  }
}
