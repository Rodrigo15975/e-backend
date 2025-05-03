import { SetMetadata } from '@nestjs/common'

export const ROLES = 'roles'

export const RolesDefault = (roles: Array<keyof KeyRoles>) =>
  SetMetadata(ROLES, roles)

export type KeyRoles = {
  ADMIN: 'ADMIN'
  USER: 'USER'
}
export type TypeRole = keyof KeyRoles

const ROLESDEFAULT: KeyRoles = {
  ADMIN: 'ADMIN',
  USER: 'USER',
}

export const { ADMIN, USER } = ROLESDEFAULT
