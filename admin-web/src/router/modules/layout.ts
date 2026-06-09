import Layout from '@/layouts/index.vue'
import type { AppRouteRecord } from '@/types/route'

import { activityRoute } from './activity'
import { attendanceRoute } from './attendance'
import { baseRoute } from './base'
import { contentRoute } from './content'
import { dashboardRoute } from './dashboard'
import { emailRoute } from './email'
import { memberRoute } from './member'
import { permissionRoute } from './permission'
import { protocolRoutes } from './protocol'
import { schoolBusRoute } from './school-bus'

/** 主布局及其业务子路由 */
export const layoutRoute: AppRouteRecord = {
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  meta: {
    title: '首页',
    titleKey: 'common.home',
    hidden: true
  },
  children: [
    dashboardRoute,
    memberRoute,
    activityRoute,
    baseRoute,
    schoolBusRoute,
    permissionRoute,
    attendanceRoute,
    emailRoute,
    contentRoute,
    ...protocolRoutes
  ]
}
