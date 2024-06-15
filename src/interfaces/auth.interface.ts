export interface AuthToken {
  token: string
  expires_in: number
}

export interface ResponseLogin {
  access_token: string
  refresh_token: string
}

export interface PayloadToken {
  id: number
  email: string
}

export interface RegisterBody {
  full_name: string
  username: string
  email: string
  password: string
}
