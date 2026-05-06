import type { LoginParams, LoginResult } from '@/types/auth'

export const loginApi = async (params: LoginParams): Promise<LoginResult> => {
  // 模板默认提供可运行的本地登录闭环；接入后端时替换为真实 Service 调用。
  if (!params.username || !params.password) {
    throw new Error('请输入账号和密码')
  }

  return {
    accessToken: `mock-token-${Date.now()}`,
    user: {
      id: '1',
      name: params.username,
      roles: ['admin']
    }
  }
}

export const logoutApi = async () => Promise.resolve()
