import type { AppRouteRecord } from '@/types/route'

/** 成员管理 */
export const memberRoute: AppRouteRecord = {
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
}
