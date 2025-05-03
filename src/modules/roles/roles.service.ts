import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { PrismaService } from 'nestjs-prisma'
import { TypeRole } from 'src/common/decorators/role.decorator'

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto
    this.invalidRole(name)
    await this.verifyRole(name)
    return await this.prismaService.role.create({
      data: {
        name,
      },
    })
  }
  private async verifyRole(role_name: TypeRole) {
    const role = await this.prismaService.role.findFirst({
      where: { name: role_name },
    })
    if (role) throw new BadRequestException('El rol ya existe')
  }

  private invalidRole(role_name: TypeRole) {
    if (role_name !== 'ADMIN' && role_name !== 'USER')
      throw new BadRequestException(`El rol ${String(role_name)} no es válido`)
  }

  async findAll() {
    const { count, roles: data } = await this.prismaService.$transaction(
      async (prisma) => ({
        roles: await prisma.role.findMany(),
        count: await prisma.role.count(),
      }),
    )

    if (!data || data.length === 0)
      return {
        data,
        status: HttpStatus.OK,
        count: 0,
      }
    return {
      data,
      status: HttpStatus.OK,
      count,
    }
  }
}
