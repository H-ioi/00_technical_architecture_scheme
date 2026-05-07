export interface LoginParams {
  username: string
  password: string
  code?: string
  randomStr?: string
}

export interface UserProfile {
  id: string
  name: string
  avatar?: string
  roles: string[]
}

export interface LoginResult {
  accessToken: string
  refreshToken?: string
  user: UserProfile
  permissions: string[]
}
