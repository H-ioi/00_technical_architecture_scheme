import type { AppRouteRecord } from '@/types/route'

/** 校车管理 */
export const schoolBusRoute: AppRouteRecord = {
  path: 'school-bus',
  name: 'SchoolBus',
  redirect: '/school-bus/route/plan',
  meta: {
    title: '校车管理',
    titleKey: 'route.schoolBus',
    icon: 'Van'
  },
  children: [
    {
      path: 'route',
      name: 'SchoolBusRoute',
      redirect: '/school-bus/route/plan',
      meta: {
        title: '路线管理',
        titleKey: 'route.schoolBusRoute'
      },
      children: [
        {
          path: 'plan',
          name: 'SchoolBusRoutePlan',
          component: () => import('@/views/school-bus/route/plan/tab.vue'),
          meta: {
            title: '路线规划',
            titleKey: 'route.schoolBusRoutePlan'
          }
        },
        {
          path: 'operation',
          name: 'SchoolBusRouteOperation',
          component: () => import('@/views/school-bus/route/operation/list.vue'),
          meta: {
            title: '路线运营',
            titleKey: 'route.schoolBusRouteOperation'
          }
        },
        {
          path: 'exception',
          name: 'SchoolBusRouteException',
          component: () => import('@/views/school-bus/route/exception/list.vue'),
          meta: {
            title: '异常上报',
            titleKey: 'route.schoolBusRouteException'
          }
        }
      ]
    },
    {
      path: 'driver',
      name: 'SchoolBusDriver',
      component: () => import('@/views/school-bus/driver/list.vue'),
      meta: {
        title: '司机管理',
        titleKey: 'route.schoolBusDriver'
      }
    },
    {
      path: 'student',
      name: 'SchoolBusStudent',
      redirect: '/school-bus/student/apply',
      meta: {
        title: '学生管理',
        titleKey: 'route.schoolBusStudent'
      },
      children: [
        {
          path: 'apply',
          name: 'SchoolBusStudentApply',
          component: () => import('@/views/school-bus/student/apply/list.vue'),
          meta: {
            title: '申请意向管理',
            titleKey: 'route.schoolBusStudentApply'
          }
        },
        {
          path: 'order',
          name: 'SchoolBusStudentOrder',
          component: () => import('@/views/school-bus/student/order/list.vue'),
          meta: {
            title: '乘车学生管理',
            titleKey: 'route.schoolBusStudentOrder'
          }
        }
      ]
    },
    {
      path: 'follow-teacher',
      name: 'SchoolBusFollowTeacher',
      component: () => import('@/views/school-bus/follow-teacher/list.vue'),
      meta: {
        title: '跟车老师',
        titleKey: 'route.schoolBusFollowTeacher'
      }
    },
    {
      path: 'car',
      name: 'SchoolBusCar',
      component: () => import('@/views/school-bus/car/list.vue'),
      meta: {
        title: '车辆管理',
        titleKey: 'route.schoolBusCar'
      }
    },
    {
      path: 'attendance',
      name: 'SchoolBusAttendance',
      component: () => import('@/views/school-bus/attendance/list.vue'),
      meta: {
        title: '校巴考勤',
        titleKey: 'route.schoolBusAttendance'
      }
    }
  ]
}
