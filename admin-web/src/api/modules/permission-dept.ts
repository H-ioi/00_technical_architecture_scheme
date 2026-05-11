import type { PermissionDeptRecord } from '@/types/modules/permission-dept'
import { request } from 'uni-ui-lib'

export default {
  tree: {
    url: '/upms/dept/tree',
    name: '部门树',
    get: async function (this: { url: string }, params?: { name?: string }) {
      return await request.get<PermissionDeptRecord[], PermissionDeptRecord[]>(this.url, {
        params
      })
    }
  },

  get: {
    url: '/upms/dept',
    name: '部门详情',
    getById: async function (this: { url: string }, id: string | number) {
      return await request.get<PermissionDeptRecord>(`${this.url}/${id}`)
    }
  },

  add: {
    url: '/upms/dept/',
    name: '新增部门',
    post: async function (this: { url: string }, data: PermissionDeptRecord) {
      return await request.post<unknown>(this.url, data)
    }
  },

  update: {
    url: '/upms/dept/',
    name: '更新部门',
    put: async function (this: { url: string }, data: PermissionDeptRecord) {
      return await request.put<unknown>(this.url, data)
    }
  },

  remove: {
    url: '/upms/dept',
    name: '删除部门',
    deleteById: async function (this: { url: string }, id: string | number) {
      return await request.delete<unknown>(`${this.url}/${id}`)
    }
  }
}
