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
        path: 'activity',
        name: 'Activity',
        redirect: '/activity/questionnaire',
        meta: {
          title: '活动管理',
          titleKey: 'route.activity',
          icon: 'Bell'
        },
        children: [
          {
            path: 'questionnaire',
            name: 'ActivityQuestionnaireList',
            component: () => import('@/views/activity/questionnaire/list.vue'),
            meta: {
              title: '问卷管理',
              titleKey: 'route.activityQuestionnaire'
            }
          },
          {
            path: 'questionnaire/detail/:id',
            name: 'ActivityQuestionnaireDetail',
            redirect: (to) => ({
              name: 'ActivityQuestionnaireDesign',
              params: { id: String(to.params.id) },
              query: { ...to.query, mode: 'view' }
            }),
            meta: {
              title: '问卷详情',
              titleKey: 'route.activityQuestionnaireDetail',
              hidden: true,
              activeMenu: '/activity/questionnaire',
              tagDetailParam: 'id'
            }
          },
          {
            path: 'questionnaire/design/:id',
            name: 'ActivityQuestionnaireDesign',
            component: () => import('@/views/activity/questionnaire/design.vue'),
            meta: {
              title: '问卷设计',
              titleKey: 'route.activityQuestionnaireDesign',
              hidden: true,
              activeMenu: '/activity/questionnaire',
              tagDetailParam: 'id'
            }
          },
          {
            path: 'questionnaire/submissions/:id',
            name: 'ActivityQuestionnaireSubmissions',
            component: () => import('@/views/activity/questionnaire/submissions.vue'),
            meta: {
              title: '问卷答卷',
              titleKey: 'route.activityQuestionnaireSubmissions',
              hidden: true,
              activeMenu: '/activity/questionnaire',
              tagDetailParam: 'id'
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
      },
      {
        path: 'email',
        name: 'Email',
        redirect: '/email/group',
        meta: {
          title: '群发邮件',
          titleKey: 'route.email',
          icon: 'Message'
        },
        children: [
          {
            path: 'group',
            name: 'EmailGroup',
            component: () => import('@/views/email/group/list.vue'),
            meta: {
              title: '群组配置',
              titleKey: 'route.emailGroup'
            }
          },
          {
            path: 'send',
            name: 'EmailSend',
            component: () => import('@/views/email/send/list.vue'),
            meta: {
              title: '发件箱配置',
              titleKey: 'route.emailSend'
            }
          },
          {
            path: 'outbox',
            name: 'EmailOutbox',
            component: () => import('@/views/email/outbox/tab.vue'),
            meta: {
              title: '发件列表',
              titleKey: 'route.emailOutbox'
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
