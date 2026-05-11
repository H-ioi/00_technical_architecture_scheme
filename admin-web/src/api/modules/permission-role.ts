import type { PageResult } from '@/types/api'
import type { PermissionRoleListParams, PermissionRoleRecord } from '@/types/modules/permission-role'
import { request } from 'uni-ui-lib'

export default {
  page: {
    url: '/upms/role/page',
    name: '角色分页',
    get: async function (this: { url: string }, params: PermissionRoleListParams) {
      return await request.get<
        PageResult<PermissionRoleRecord>,
        PageResult<PermissionRoleRecord>
      >(this.url, { params })
    }
  },

  add: {
    url: '/upms/role',
    name: '新增角色',
    post: async function (this: { url: string }, data: unknown) {
      return await request.post<unknown>(this.url, data)
    }
  },

  update: {
    url: '/upms/role',
    name: '更新角色',
    put: async function (this: { url: string }, data: unknown) {
      return await request.put<unknown>(this.url, data)
    }
  },

  remove: {
    url: '/upms/role',
    name: '删除角色',
    deleteById: async function (this: { url: string }, id: string | number) {
      return await request.delete<unknown>(`${this.url}/${id}`)
    }
  },

  assignMenu: {
    url: '/upms/role/menu',
    name: '角色分配菜单',
    put: async function (this: { url: string }, body: { roleId: string | number; menuIds: string }) {
      return await request.put<unknown>(this.url, body)
    }
  },

  /** 获取角色已有菜单勾选（`/upms/menu/role/:roleId`）。 */
  roleMenuChecked: {
    url: '/upms/menu/role',
    name: '角色菜单勾选',
    get: async function (this: { url: string }, roleId: string | number) {
      return await request.get<(string | number)[], (string | number)[]>(`${this.url}/${roleId}`)
    }
  },

  listSimple: {
    url: '/upms/role/list',
    name: '角色简略列表',
    get: async function (this: { url: string }) {
      return await request.get<unknown[]>(this.url)
    }
  }
}
