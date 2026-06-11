/** 登录请求体：OAuth 网关字段，仅存于模板项目（非组件库契约）。 */
export interface LoginParams {
  username: string
  password: string
  code?: string
  randomStr?: string
}

/** OAuth 用户信息片段（网关原始字段）。 */
export interface OAuthTokenUserInfo {
  userId?: string | number
  id?: string | number
  username?: string
  nickname?: string
  avatar?: string
  authorities?: Array<{ authority?: string; permission?: string } | string>
}

/** OAuth password 模式接口返回（网关原始字段）。 */
export interface OAuthTokenResult {
  access_token: string
  refresh_token?: string
  user_info?: OAuthTokenUserInfo
}
