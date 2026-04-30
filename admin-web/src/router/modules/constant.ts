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
        redirect: '/uni-lib-demo/standard-table',
        meta: {
          title: '组件库案例',
          icon: 'Grid',
          permission: ['uni-lib:demo:view']
        },
        children: [
          {
            path: 'standard-table',
            name: 'UniLibStandardTable',
            component: () => import('@/views/uni-lib-demo/standard-table-page.vue'),
            meta: {
              title: '常规表格页',
              permission: ['uni-lib:demo:view']
            }
          },
          {
            path: 'plain-table',
            name: 'UniLibPlainTable',
            component: () => import('@/views/uni-lib-demo/plain-table-page.vue'),
            meta: {
              title: '无搜索表格页',
              permission: ['uni-lib:demo:view']
            }
          },
          {
            path: 'tree-table',
            name: 'UniLibTreeTable',
            component: () => import('@/views/uni-lib-demo/tree-table-page.vue'),
            meta: {
              title: '树形表格页',
              permission: ['uni-lib:demo:view']
            }
          },
          {
            path: 'no-pagination-table',
            name: 'UniLibNoPaginationTable',
            component: () => import('@/views/uni-lib-demo/no-pagination-table-page.vue'),
            meta: {
              title: '无分页表格页',
              permission: ['uni-lib:demo:view']
            }
          },
          {
            path: 'table-link-detail',
            name: 'UniLibTableLinkDetail',
            component: () => import('@/views/uni-lib-demo/table-link-detail-page.vue'),
            meta: {
              title: '表格跳转表单',
              permission: ['uni-lib:demo:view']
            }
          },
          {
            path: 'table-dialog-detail',
            name: 'UniLibTableDialogDetail',
            component: () => import('@/views/uni-lib-demo/table-dialog-detail-page.vue'),
            meta: {
              title: '表格弹窗表单',
              permission: ['uni-lib:demo:view']
            }
          },
          {
            path: 'table-detail/:id',
            name: 'UniLibTableDetail',
            component: () => import('@/views/uni-lib-demo/table-detail-page.vue'),
            meta: {
              title: '客户详情',
              hidden: true,
              activeMenu: '/uni-lib-demo/table-link-detail',
              permission: ['uni-lib:demo:view']
            }
          },
          {
            path: 'table-edit/:id',
            name: 'UniLibTableEdit',
            component: () => import('@/views/uni-lib-demo/table-edit-page.vue'),
            meta: {
              title: '客户编辑',
              hidden: true,
              activeMenu: '/uni-lib-demo/table-link-detail',
              permission: ['uni-lib:demo:view']
            }
          }
        ]
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
