/** 登录请求体：OAuth 网关字段，仅存于模板项目（非组件库契约）。 */
export interface LoginParams {
  username: string
  password: string
  code?: string
  randomStr?: string
}
