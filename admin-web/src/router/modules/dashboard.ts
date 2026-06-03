import type { AppRouteRecord } from '@/types/route'

/** 工作台 */
export const dashboardRoute: AppRouteRecord = {
  path: 'dashboard',
  name: 'Dashboard',
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    title: '工作台',
    titleKey: 'route.dashboard',
    icon: 'House',
    affix: true
  }
}
