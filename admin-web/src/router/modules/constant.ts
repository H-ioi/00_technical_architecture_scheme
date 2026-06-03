import type { AppRouteRecord } from '@/types/route'

/** 登录页（免鉴权） */
export const loginRoute: AppRouteRecord = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/index.vue'),
  meta: {
    title: '登录',
    titleKey: 'common.login',
    hidden: true
  }
}

/** 无权限页 */
export const forbiddenRoute: AppRouteRecord = {
  path: '/403',
  name: 'Forbidden',
  component: () => import('@/layouts/error/403.vue'),
  meta: {
    title: '无权限',
    titleKey: 'common.forbidden',
    hidden: true
  }
}

/** 404 */
export const notFoundRoute: AppRouteRecord = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/layouts/error/404.vue'),
  meta: {
    title: '页面不存在',
    titleKey: 'common.notFound',
    hidden: true
  }
}
