export interface LoginParams {
  username: string
  password: string
  code?: string
  randomStr?: string
}

export interface ChangePasswordParams {
  username: string
  password: string
  newpassword1: string
  newpassword2: string
}

export interface UserProfile {
  id: string
  username?: string
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
