import AdminLayout from '@/layouts/admin-layout.vue'
import type { AppRouteRecord } from '@/types/route'

export const constantRoutes: AppRouteRecord[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/login-page.vue'),
    meta: {
      title: '登录',
      titleKey: 'common.login',
      hidden: true
    }
  },
  {
    path: '/',
    component: AdminLayout,
    redirect: '/dashboard',
    meta: {
      title: '首页',
      titleKey: 'common.home',
      hidden: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/dashboard-page.vue'),
        meta: {
          title: '工作台',
          titleKey: 'route.dashboard',
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
          titleKey: 'route.uniLibDemo',
          icon: 'Grid',
          permission: ['uni-lib:demo:view']
        },
        children: [
          {
            path: 'standard-table',
            name: 'UniLibStandardTable',
            component: () => import('@/views/uni-lib-demo/table-basic/standard-table-page.vue'),
            meta: {
              title: '常规表格页',
              titleKey: 'route.standardTable',
              permission: ['uni-lib:demo:view']
            }
          },
          {
            path: 'plain-table',
            name: 'UniLibPlainTable',
            component: () => import('@/views/uni-lib-demo/table-basic/plain-table-page.vue'),
            meta: {
              title: '无搜索表格页',
              titleKey: 'route.plainTable',
              permission: ['uni-lib:demo:view']
            }
          },
          {
            path: 'tree-table',
            name: 'UniLibTreeTable',
            component: () => import('@/views/uni-lib-demo/table-tree/tree-table-page.vue'),
            meta: {
              title: '树形表格页',
              titleKey: 'route.treeTable',
              permission: ['uni-lib:demo:view']
            }
          },
          {
            path: 'no-pagination-table',
            name: 'UniLibNoPaginationTable',
            component: () =>
              import('@/views/uni-lib-demo/table-basic/no-pagination-table-page.vue'),
            meta: {
              title: '无分页表格页',
              titleKey: 'route.noPaginationTable',
              permission: ['uni-lib:demo:view']
            }
          },
          {
            path: 'table-link-detail',
            name: 'UniLibTableLinkDetail',
            component: () => import('@/views/uni-lib-demo/table-form-page/table-link-page.vue'),
            meta: {
              title: '表格跳转表单',
              titleKey: 'route.tableLinkForm',
              permission: ['uni-lib:demo:view']
            }
          },
          {
            path: 'table-dialog-detail',
            name: 'UniLibTableDialogDetail',
            component: () => import('@/views/uni-lib-demo/table-form-dialog/table-dialog-page.vue'),
            meta: {
              title: '表格弹窗表单',
              titleKey: 'route.tableDialogForm',
              permission: ['uni-lib:demo:view']
            }
          },
          {
            path: 'table-detail/:id',
            name: 'UniLibTableDetail',
            component: () => import('@/views/uni-lib-demo/table-form-page/detail-page.vue'),
            meta: {
              title: '客户详情',
              titleKey: 'route.customerDetail',
              hidden: true,
              activeMenu: '/uni-lib-demo/table-link-detail',
              permission: ['uni-lib:demo:view']
            }
          },
          {
            path: 'table-edit/:id',
            name: 'UniLibTableEdit',
            component: () => import('@/views/uni-lib-demo/table-form-page/edit-page.vue'),
            meta: {
              title: '客户编辑',
              titleKey: 'route.customerEdit',
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
      titleKey: 'common.forbidden',
      hidden: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/not-found-page.vue'),
    meta: {
      title: '页面不存在',
      titleKey: 'common.notFound',
      hidden: true
    }
  }
]
