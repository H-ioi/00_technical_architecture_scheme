import Layout from '@/layouts/index.vue'
import type { AppRouteRecord } from '@/types/route'

/** 静态路由表（登录、布局子路由、403/404）。 */
export const routes: AppRouteRecord[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      titleKey: 'common.login',
      hidden: true
    }
  },
  {
    path: '/',
    component: Layout,
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
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '工作台',
          titleKey: 'route.dashboard',
          icon: 'House',
          affix: true
        }
      },
      {
        path: 'member',
        name: 'Member',
        redirect: '/member/student',
        meta: {
          title: '成员管理',
          titleKey: 'route.member',
          icon: 'User'
        },
        children: [
          {
            path: 'student',
            name: 'MemberStudent',
            component: () => import('@/views/member/student/list.vue'),
            meta: {
              title: '学生列表',
              titleKey: 'route.memberStudent'
            }
          },
          {
            path: 'teacher',
            name: 'MemberTeacher',
            component: () => import('@/views/member/teacher/list.vue'),
            meta: {
              title: '教师列表',
              titleKey: 'route.memberTeacher'
            }
          }
        ]
      },
      {
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
      },
      {
        path: 'protocol',
        name: 'Protocol',
        component: () => import('@/views/protocol/list.vue'),
        meta: {
          title: '协议管理',
          titleKey: 'route.protocol',
          icon: 'Document'
        }
      },
      {
        path: 'protocol/detail/:id',
        name: 'ProtocolDetail',
        component: () => import('@/views/protocol/detail.vue'),
        meta: {
          title: '协议详情',
          titleKey: 'route.protocolDetail',
          hidden: true,
          activeMenu: '/protocol',
          tagDetailParam: 'id'
        }
      }
    ]
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/layouts/error/403.vue'),
    meta: {
      title: '无权限',
      titleKey: 'common.forbidden',
      hidden: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/layouts/error/404.vue'),
    meta: {
      title: '页面不存在',
      titleKey: 'common.notFound',
      hidden: true
    }
  }
]
