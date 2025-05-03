import {
  Controller,
  Get,
  Post,
  Body,
  VERSION_NEUTRAL,
  UseGuards,
} from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { AuthUserGuard } from '../auth/guards/auth.guard'
import { RoleService } from './roles.service'

@Controller({
  path: 'roles',
  version: VERSION_NEUTRAL,
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  // @UseGuards(AuthUserGuard)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }
  @UseGuards(AuthUserGuard)
  @Get()
  findAll() {
    return this.roleService.findAll()
  }
}
