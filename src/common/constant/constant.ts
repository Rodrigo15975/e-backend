export const SECRETS: Record<string, string> = {
  JWT: String(process.env.SECRET) || 'ECOMMERCE',
  EXP: process.env.EXP || '5d',
}
