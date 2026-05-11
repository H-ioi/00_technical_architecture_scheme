import type { PageResult } from '@/types/api'
import type { PermissionUserListParams, PermissionUserRecord } from '@/types/modules/permission-user'
import { request } from 'uni-ui-lib'

export default {
  page: {
    url: '/upms/user/page',
    name: '用户分页',
    get: async function (this: { url: string }, params: PermissionUserListParams) {
      return await request.get<
        PageResult<PermissionUserRecord>,
        PageResult<PermissionUserRecord>
      >(this.url, { params })
    }
  },

  add: {
    url: '/upms/user',
    name: '新增用户',
    post: async function (this: { url: string }, data: unknown) {
      return await request.post<unknown>(this.url, data)
    }
  },

  update: {
    url: '/upms/user',
    name: '更新用户',
    put: async function (this: { url: string }, data: unknown) {
      return await request.put<unknown>(this.url, data)
    }
  },

  remove: {
    url: '/upms/user',
    name: '删除用户',
    deleteById: async function (this: { url: string }, userId: string | number) {
      return await request.delete<unknown>(`${this.url}/${userId}`)
    }
  },

  usernameExistsCheck: {
    url: '/upms/user/details',
    name: '用户名占用查询',
    get: async function (this: { url: string }, username: string) {
      return await request.get<unknown>(`${this.url}/${username}`)
    }
  }
}
