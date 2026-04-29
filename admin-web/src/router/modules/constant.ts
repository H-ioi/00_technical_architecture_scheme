import AdminLayout from '@/layouts/admin-layout.vue'
import type { AppRouteRecord } from '@/types/route'

export const constantRoutes: AppRouteRecord[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/login-page.vue'),
    meta: {
      title: '登录',
      hidden: true
    }
  },
  {
    path: '/',
    component: AdminLayout,
    redirect: '/dashboard',
    meta: {
      title: '首页',
      hidden: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/dashboard-page.vue'),
        meta: {
          title: '工作台',
          icon: 'DataBoard',
          affix: true,
          permission: ['dashboard:view']
        }
      },
      {
        path: 'uni-lib-demo',
        name: 'UniLibDemo',
        component: () => import('@/views/uni-lib-demo/uni-lib-demo-page.vue'),
        meta: {
          title: '组件库示例',
          icon: 'Grid',
          permission: ['uni-lib:demo:view']
        }
      }
    ]
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/forbidden-page.vue'),
    meta: {
      title: '无权限',
      hidden: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/not-found-page.vue'),
    meta: {
      title: '页面不存在',
      hidden: true
    }
  }
]
