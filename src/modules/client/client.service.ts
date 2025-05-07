import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'
import { ListClientDto } from './dto/list.client.dto'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class ClientService {
  constructor(private readonly prismaClient: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    const { details_service, dni, phone, stado } = createClientDto
    const findPhone = await this.prismaClient.clients.findUnique({
      where: {
        phone,
      },
    })
    if (findPhone)
      throw new ConflictException(`El telefono ${phone} ya esta registrado`)

    const findDni = await this.prismaClient.clients.findUnique({
      where: {
        dni,
      },
    })
    if (findDni) throw new ConflictException(`El DNI ${dni} ya esta registrado`)

    const client = await this.prismaClient.clients.create({
      data: {
        details_service,
        dni,
        phone,
        stado,
      },
    })
    return {
      message: 'Cliente registrado con exito',
      status: HttpStatus.CREATED,
      data: client,
    }
  }

  async findAll(listDtoClient: ListClientDto) {
    const { page, size } = listDtoClient
    const [data, count] = await this.prismaClient.$transaction([
      this.prismaClient.clients.findMany({
        skip: (page - 1) * size,
        take: size,
        orderBy: [{ createdAt: 'desc' }, { updatedAt: 'desc' }],
      }),
      this.prismaClient.clients.count(),
    ])

    if (!data || data.length === 0)
      return {
        data: [],
        status: HttpStatus.OK,
        count: 0,
      }
    return {
      data,
      status: HttpStatus.OK,
      count,
    }
  }

  async findOne(id: string) {
    const client = await this.prismaClient.clients.findUnique({
      where: {
        id,
      },
    })
    if (!client)
      return {
        message: 'Cliente no encontrado',
        status: HttpStatus.NOT_FOUND,
      }

    return {
      message: 'Cliente encontrado con exito',
      status: HttpStatus.OK,
      data: client,
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const { details_service, dni, phone, stado } = updateClientDto

    const existingClient = await this.prismaClient.clients.findUnique({
      where: { id },
    })

    if (!existingClient) throw new NotFoundException('Cliente no encontrado')

    const isFieldChanged = (field: string, newValue: string | undefined) =>
      newValue && newValue !== existingClient[field]

    const checkFieldExists = async (
      field: 'dni' | 'phone',
      value: string | undefined,
    ) => {
      const existing = await this.prismaClient.clients.findFirst({
        where: {
          [field]: value,
          NOT: { id },
        },
      })
      if (existing) {
        throw new ConflictException(
          `El ${field} ya está registrado en otro cliente`,
        )
      }
    }

    if (isFieldChanged('phone', phone)) await checkFieldExists('phone', phone)

    if (isFieldChanged('dni', dni)) await checkFieldExists('dni', dni)

    const client = await this.prismaClient.clients.update({
      where: { id },
      data: {
        details_service,
        dni,
        phone,
        stado,
      },
    })

    return {
      message: 'Cliente actualizado con éxito',
      status: HttpStatus.OK,
      data: client,
    }
  }

  async remove(id: string) {
    const client = await this.prismaClient.clients.delete({
      where: {
        id,
      },
    })
    if (!client)
      return {
        message: 'Cliente no encontrado',
        status: HttpStatus.NOT_FOUND,
      }
    return {
      message: 'Cliente eliminado con exito',
      status: HttpStatus.OK,
      data: client,
    }
  }
}
