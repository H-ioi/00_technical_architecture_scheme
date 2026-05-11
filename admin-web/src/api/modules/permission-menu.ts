import type { PermissionMenuNode } from '@/types/modules/permission-menu'
import { request } from 'uni-ui-lib'

export default {
  /** 租户菜单树（旧页：`fetchMenuTree`）。 */
  treeTenant: {
    url: '/upms/menu/tenant/get',
    name: '租户菜单树',
    get: async function (this: { url: string }, params?: { lazy?: boolean; parentId?: string | number }) {
      return await request.get<PermissionMenuNode[], PermissionMenuNode[]>(this.url, {
        params: params ?? { lazy: false }
      })
    }
  },

  /** 租户侧菜单编辑提交（旧页：`putObj` → `/upms/menu/tenant/edit`）。 */
  tenantEdit: {
    url: '/upms/menu/tenant/edit',
    name: '租户菜单保存',
    post: async function (this: { url: string }, data: unknown) {
      return await request.post<unknown>(this.url, data)
    }
  }
}
