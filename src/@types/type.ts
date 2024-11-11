export interface RegistrationBody {
  name: string
  email: string
  password: string
}
export interface RegistrationResponse {
  success: boolean
  message: string
  user?: {
    id: number
    name: string
    email: string
  }
  token?: string
}

export interface LoginBody {
  email: string
  password: string
}
export interface LoginResponse {
  success: boolean
  message: string
  user?: {
    id: number
    name: string
    email: string
  }
  token?: string
}
export interface ConfirmEmailParams {
  id: string
}
export interface ConfirmEmailResponse {
  success: boolean
  userId?: string
  message: string
}
