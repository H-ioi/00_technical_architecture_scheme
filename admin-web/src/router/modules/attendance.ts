import type { AppRouteRecord } from '@/types/route'

/** 考勤管理 */
export const attendanceRoute: AppRouteRecord = {
  path: 'attendance',
  name: 'Attendance',
  redirect: '/attendance/student',
  meta: {
    title: '考勤管理',
    titleKey: 'route.attendance',
    icon: 'Calendar'
  },
  children: [
    {
      path: 'student',
      name: 'AttendanceStudent',
      component: () => import('@/views/attendance/student/list.vue'),
      meta: {
        title: '学生考勤',
        titleKey: 'route.attendanceStudent'
      }
    },
    {
      path: 'daily',
      name: 'AttendanceDaily',
      component: () => import('@/views/attendance/daily/list.vue'),
      meta: {
        title: '学生每日考勤',
        titleKey: 'route.attendanceDaily'
      }
    },
    {
      path: 'holiday',
      name: 'AttendanceHoliday',
      component: () => import('@/views/attendance/holiday/tab.vue'),
      meta: {
        title: '请假管理',
        titleKey: 'route.attendanceHoliday'
      }
    },
    {
      path: 'flow/edit/create',
      name: 'AttendanceHolidayFlowDesignCreate',
      component: () => import('@/views/attendance/flow/edit.vue'),
      meta: {
        title: '新增流程',
        titleKey: 'route.attendanceHolidayFlowDesign',
        hidden: true,
        activeMenu: '/attendance/flow'
      }
    },
    {
      path: 'flow/edit/:id',
      name: 'AttendanceHolidayFlowDesignEdit',
      component: () => import('@/views/attendance/flow/edit.vue'),
      meta: {
        title: '编辑流程',
        titleKey: 'route.attendanceHolidayFlowDesign',
        hidden: true,
        activeMenu: '/attendance/flow',
        tagDetailParam: 'id'
      }
    },
    /** 旧 URL `/attendance/flow/design/*` 兼容 */
    {
      path: 'flow/design/create',
      redirect: '/attendance/flow/edit/create'
    },
    {
      path: 'flow/design/:id',
      redirect: (to) => ({
        path: `/attendance/flow/edit/${encodeURIComponent(String(to.params.id))}`
      })
    },
    {
      path: 'flow',
      name: 'AttendanceHolidayFlow',
      component: () => import('@/views/attendance/flow/list.vue'),
      meta: {
        title: '流程设计',
        titleKey: 'route.attendanceHolidayFlow'
      }
    },
    {
      path: 'task',
      name: 'AttendanceHolidayTask',
      component: () => import('@/views/attendance/task/tab.vue'),
      meta: {
        title: '任务处理',
        titleKey: 'route.attendanceHolidayTask'
      }
    },
    {
      path: 'config',
      name: 'AttendanceHolidayConfig',
      component: () => import('@/views/attendance/config/list.vue'),
      meta: {
        title: '配置管理',
        titleKey: 'route.attendanceHolidayConfig'
      }
    },
    {
      path: 'pass',
      name: 'AttendanceHolidayPass',
      component: () => import('@/views/attendance/pass/list.vue'),
      meta: {
        title: '放行条管理',
        titleKey: 'route.attendanceHolidayPass'
      }
    },
    /** 旧书签 / 后端仍下发 `/attendance/holiday/*` 时的兼容跳转 */
    {
      path: 'holiday/flow/design/create',
      redirect: '/attendance/flow/edit/create'
    },
    {
      path: 'holiday/flow/design/:id',
      redirect: (to) => ({
        path: `/attendance/flow/edit/${encodeURIComponent(String(to.params.id))}`
      })
    },
    {
      path: 'holiday/flow',
      redirect: '/attendance/flow'
    },
    {
      path: 'holiday/task',
      redirect: '/attendance/task'
    },
    {
      path: 'holiday/config',
      redirect: '/attendance/config'
    },
    {
      path: 'holiday/pass',
      redirect: '/attendance/pass'
    },
    {
      path: 'school',
      name: 'AttendanceSchool',
      component: () => import('@/views/attendance/school/list.vue'),
      meta: {
        title: '校园考勤',
        titleKey: 'route.attendanceSchool'
      }
    },
    {
      path: 'access',
      name: 'AttendanceAccess',
      component: () => import('@/views/attendance/access/list.vue'),
      meta: {
        title: '门禁记录',
        titleKey: 'route.attendanceAccess'
      }
    },
    {
      path: 'wechat',
      name: 'AttendanceWechat',
      component: () => import('@/views/attendance/wechat/list.vue'),
      meta: {
        title: '微信 OpenID',
        titleKey: 'route.attendanceWechat'
      }
    },
    {
      path: 'wechat-notice',
      name: 'AttendanceWechatNotice',
      component: () => import('@/views/attendance/wechat-notice/list.vue'),
      meta: {
        title: '微信通知',
        titleKey: 'route.attendanceWechatNotice'
      }
    }
  ]
}
