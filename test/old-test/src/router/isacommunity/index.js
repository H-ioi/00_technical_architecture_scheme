import Layout from '@/page/index/'

export default [
  {
    path: '/isacommunity',
    component: Layout,
    children: [
      {
        path: '/isacommunity/home/index',
        name: '首页',
        meta: {
          enName: 'Home'
        },
        component: () => import('@/views/isacommunity/home/index.vue')
      },
      {
        path: '/isacommunity/member/student/index',
        name: '学生列表',
        meta: {
          enName: 'Student List'
        },
        component: () => import('@/views/isacommunity/member/student/index.vue')
      },
      {
        path: '/isacommunity/member/teacher/index',
        name: '教师列表',
        meta: {
          enName: 'Teacher List'
        },
        component: () => import('@/views/isacommunity/member/teacher/index.vue')
      },
      {
        path: '/isacommunity/member/teacher/detail',
        name: '教师详情',
        meta: {
          enName: 'Teacher Detail'
        },
        component: () => import('@/page/isacommunity/member/teacher/detail.vue')
      },
      {
        path: '/isacommunity/activity/detail/index',
        name: '活动详情',
        meta: {
          enName: 'Activity Detail'
        },
        component: () => import('@/views/isacommunity/activity/list/detail/index.vue')
      },
      {
        path: '/isacommunity/activity/program/detail/index',
        name: '活动项目详情',
        meta: {
          enName: 'Activity Program Detail'
        },
        component: () => import('@/views/isacommunity/activity/program/detail/index.vue')
      },
      {
        path: '/isacommunity/activity/questionnaire/form',
        name: '问卷表单',
        meta: {
          enName: 'Questionnaire Form'
        },
        component: () => import('@/views/isacommunity/activity/questionnaire/templateform.vue')
      },
      {
        path: '/isacommunity/activity/questionnaire/templateresult',
        name: '问卷表单',
        meta: {
          enName: 'Questionnaire Form'
        },
        component: () => import('@/views/isacommunity/activity/questionnaire/templateresult.vue')
      },

      {
        path: '/isacommunity/attendance/holiday/flow',
        name: '请假流程',
        meta: {
          enName: 'Holiday Flo2w'
        },
        component: () => import('@/views/isacommunity/attendance/holiday/flow.vue')
      },

      {
        path: '/isacommunity/attendance/holiday/flow/add',
        name: '新增请假流程',
        meta: {
          enName: 'Holiday Flow'
        },
        component: () => import('@/views/isacommunity/attendance/holiday/flowdesign.vue')
      },

      {
        path: '/isacommunity/attendance/holiday/flow/:id',
        name: '请假流程详情',
        meta: {
          enName: 'Holiday Flow'
        },
        component: () => import('@/views/isacommunity/attendance/holiday/flowdesign.vue')
      },
      {
        path: '/isacommunity/content/announcement/index',
        name: '公告内容',
        meta: {
          enName: 'Announcement Content'
        },
        component: () => import('@/views/isacommunity/content/announcement/index.vue')
      },
      {
        path: '/isacommunity/content/article/list/index',
        name: '文章内容',
        meta: {
          enName: 'Article Content'
        },
        component: () => import('@/views/isacommunity/content/article/list/index.vue')
      },
      {
        path: '/isacommunity/dorm/space/floor',
        name: '楼层管理',
        meta: {
          keepAlive: false
        },
        component: () => import(/* webpackChunkName: "views" */ '@/views/isacommunity/dorm/space/floor.vue')
      },
      {
        path: '/isacommunity/dorm/space/room',
        name: '房间管理',
        meta: {
          keepAlive: false
        },
        component: () => import(/* webpackChunkName: "views" */ '@/views/isacommunity/dorm/space/room.vue')
      },
      {
        path: '/isacommunity/dorm/space/building',
        name: '楼栋管理',
        meta: {
          keepAlive: false
        },
        component: () => import(/* webpackChunkName: "views" */ '@/views/isacommunity/dorm/space/building.vue')
      },
      {
        path: '/isacommunity/dorm/space/room/:id',
        name: '床位分配',
        meta: {
          enName: 'Room Assignment'
        },
        component: () => import('@/views/isacommunity/dorm/space/room-assigne.vue')
      },
      {
        path: '/isacommunity/schoolbus/route/plan/form',
        name: '路线表单',
        meta: {
          enName: 'Bus Route Form'
        },
        component: () => import('@/views/isacommunity/schoolbus/route/plan/modal/routeform.vue')
      },
      {
        path: '/isacommunity/schoolbus/student/apply/form',
        name: '乘车申请表单',
        meta: {
          enName: 'Bus Apply Form'
        },
        component: () => import('@/views/isacommunity/schoolbus/student/apply/modal/form.vue')
      },
      {
        path: '/isacommunity/schoolbus/student/order/form',
        name: '乘车学生表单',
        meta: {
          enName: 'Bus Student Order Form'
        },
        component: () => import('@/views/isacommunity/schoolbus/student/apply/modal/form.vue'),
        props: { formType: 'order' }
      },
      {
        path: '/isacommunity/dorm/space/floor',
        name: '楼层管理',
        meta: {
          enName: 'Dormitory Floor Management',
          keepAlive: false
        },
        component: () => import('@/views/isacommunity/dorm/space/floor.vue')
      },
      {
        path: '/isacommunity/dorm/space/room',
        name: '房间管理',
        meta: {
          enName: 'Room Management',
          keepAlive: false
        },
        component: () => import('@/views/isacommunity/dorm/space/room.vue')
      },
      {
        path: '/isacommunity/dorm/space/building',
        name: '楼栋管理',
        meta: {
          enName: 'Building Management',
          keepAlive: false
        },
        component: () => import('@/views/isacommunity/dorm/space/building.vue')
      },
      {
        path: '/isacommunity/dorm/space/room/:id',
        name: '床位分配',
        meta: {
          enName: 'Room Assignment'
        },
        component: () => import('@/views/isacommunity/dorm/space/room-assigne.vue')
      }
    ]
  }
]
