import * as argon from 'argon2'

// Encript password
export const hashPassword = async (password: string) =>
  await argon.hash(password)

// Verify password encript
export const verifyPassword = async (hashPassword: string, password: string) =>
  await argon.verify(hashPassword, password)
