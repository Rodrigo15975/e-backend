export interface User {
  user_id: string
  name: string
  role: {
    id: string
    name: string
  }
  iat?: number
  exp?: number
}
