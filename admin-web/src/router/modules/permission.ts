import type { AppRouteRecord } from '@/types/route'

/** 权限管理 */
export const permissionRoute: AppRouteRecord = {
  path: 'permission',
  name: 'Permission',
  redirect: '/permission/menu',
  meta: {
    title: '权限管理',
    titleKey: 'route.permission',
    icon: 'Lock'
  },
  children: [
    {
      path: 'menu',
      name: 'PermissionMenu',
      component: () => import('@/views/permission/menu/list.vue'),
      meta: {
        title: '菜单管理',
        titleKey: 'route.permissionMenu'
      }
    },
    {
      path: 'role',
      name: 'PermissionRole',
      component: () => import('@/views/permission/role/list.vue'),
      meta: {
        title: '角色管理',
        titleKey: 'route.permissionRole'
      }
    },
    {
      path: 'dept',
      name: 'PermissionDept',
      component: () => import('@/views/permission/dept/list.vue'),
      meta: {
        title: '部门管理',
        titleKey: 'route.permissionDept'
      }
    },
    {
      path: 'user',
      name: 'PermissionUser',
      component: () => import('@/views/permission/user/list.vue'),
      meta: {
        title: '用户管理',
        titleKey: 'route.permissionUser'
      }
    }
  ]
}
