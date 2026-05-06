export interface LoginParams {
  username: string
  password: string
}

export interface UserProfile {
  id: string
  name: string
  avatar?: string
  roles: string[]
}

export interface LoginResult {
  accessToken: string
  user: UserProfile
}
