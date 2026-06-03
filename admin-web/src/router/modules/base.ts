import type { AppRouteRecord } from '@/types/route'

/** 基础设置 */
export const baseRoute: AppRouteRecord = {
  path: 'base',
  name: 'Base',
  redirect: '/base/school',
  meta: {
    title: '基础设置',
    titleKey: 'route.base',
    icon: 'Setting'
  },
  children: [
    {
      path: 'school',
      name: 'BaseSchool',
      component: () => import('@/views/base/school/list.vue'),
      meta: {
        title: '校区配置',
        titleKey: 'route.baseSchool'
      }
    },
    {
      path: 'grade',
      name: 'BaseGrade',
      component: () => import('@/views/base/grade/list.vue'),
      meta: {
        title: '年级配置',
        titleKey: 'route.baseGrade'
      }
    }
  ]
}
