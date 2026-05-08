import type { MenuPermissionResult } from '@/types/permission'
import type { AppMenuRecord } from '@/types/route'
import { request } from '@/utils/request'

interface BackendMenuRecord {
  id?: string | number
  path?: string
  name?: string
  label?: string
  icon?: string
  permission?: string | string[]
  permissions?: string | string[]
  children?: BackendMenuRecord[]
}

const firstPhaseMenus: AppMenuRecord[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: '首页',
      titleKey: 'route.dashboard',
      icon: 'House',
      affix: true
    }
  },
  {
    path: '/member',
    name: 'Member',
    meta: {
      title: '成员管理',
      titleKey: 'route.member',
      icon: 'User'
    },
    children: [
      {
        path: '/member/student',
        name: 'MemberStudent',
        meta: {
          title: '学生列表',
          titleKey: 'route.memberStudent'
        }
      },
      {
        path: '/member/teacher',
        name: 'MemberTeacher',
        meta: {
          title: '教师列表',
          titleKey: 'route.memberTeacher'
        }
      }
    ]
  },
  {
    path: '/protocol',
    name: 'Protocol',
    meta: {
      title: '协议管理',
      titleKey: 'route.protocol',
      icon: 'Document'
    }
  }
]

/** 查询菜单和权限码。 */
export const fetchMenuPermissions = async (): Promise<MenuPermissionResult> => {
  await request.get<BackendMenuRecord[], BackendMenuRecord[]>('/upms/menu/user')

  return {
    menus: firstPhaseMenus,
    permissions: []
  }
}
