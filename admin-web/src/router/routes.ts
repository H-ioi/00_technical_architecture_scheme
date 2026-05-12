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
          }
        ]
      },
      {
        path: 'permission',
        name: 'Permission',
        redirect: '/permission/menu',
        meta: {
          title: '权限管理',
          titleKey: 'route.permission',
          icon: 'Lock'
        },
        children: [
          {
            path: 'menu',
            name: 'PermissionMenu',
            component: () => import('@/views/permission/menu/list.vue'),
            meta: {
              title: '菜单管理',
              titleKey: 'route.permissionMenu'
            }
          },
          {
            path: 'role',
            name: 'PermissionRole',
            component: () => import('@/views/permission/role/list.vue'),
            meta: {
              title: '角色管理',
              titleKey: 'route.permissionRole'
            }
          },
          {
            path: 'dept',
            name: 'PermissionDept',
            component: () => import('@/views/permission/dept/list.vue'),
            meta: {
              title: '部门管理',
              titleKey: 'route.permissionDept'
            }
          },
          {
            path: 'user',
            name: 'PermissionUser',
            component: () => import('@/views/permission/user/list.vue'),
            meta: {
              title: '用户管理',
              titleKey: 'route.permissionUser'
            }
          }
        ]
      },
      {
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
