import type { AppRouteRecord } from '@/types/route'

/** 活动管理 */
export const activityRoute: AppRouteRecord = {
  path: 'activity',
  name: 'Activity',
  redirect: '/activity/list',
  meta: {
    title: '活动管理',
    titleKey: 'route.activity',
    icon: 'Bell'
  },
  children: [
    {
      path: 'list',
      name: 'ActivityEventList',
      component: () => import('@/views/activity/list/list.vue'),
      meta: {
        title: '活动列表',
        titleKey: 'route.activityEventList'
      }
    },
    {
      path: 'detail',
      name: 'ActivityEventDetail',
      component: () => import('@/views/activity/detail/index.vue'),
      meta: {
        title: '活动详情',
        titleKey: 'route.activityEventDetail',
        hidden: true,
        activeMenu: '/activity/list'
      }
    },
    {
      path: 'program',
      name: 'ActivityProgramList',
      component: () => import('@/views/activity/program/list.vue'),
      meta: {
        title: '活动项目',
        titleKey: 'route.activityProgram'
      }
    },
    {
      path: 'program/detail',
      name: 'ActivityProgramDetail',
      component: () => import('@/views/activity/program/edit/index.vue'),
      meta: {
        title: '活动项目详情',
        titleKey: 'route.activityProgramDetail',
        hidden: true,
        activeMenu: '/activity/program'
      }
    },
    {
      path: 'prize',
      name: 'ActivityPrizeList',
      component: () => import('@/views/activity/prize/list.vue'),
      meta: {
        title: '奖品列表',
        titleKey: 'route.activityPrize'
      }
    },
    {
      path: 'vote-program',
      name: 'ActivityVoteProgramList',
      component: () => import('@/views/activity/vote-program/list.vue'),
      meta: {
        title: '投票节目',
        titleKey: 'route.activityVoteProgram'
      }
    },
    {
      path: 'wechat-school',
      name: 'ActivityWechatSchoolList',
      component: () => import('@/views/activity/wechat-school/list.vue'),
      meta: {
        title: '微信配置',
        titleKey: 'route.activityWechatSchool'
      }
    },
    {
      path: 'email-school',
      name: 'ActivityEmailSchoolList',
      component: () => import('@/views/activity/email-school/list.vue'),
      meta: {
        title: '邮箱配置',
        titleKey: 'route.activityEmailSchool'
      }
    },
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
        name: 'ActivityQuestionnaireEdit',
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
      path: 'questionnaire/edit/:id',
      name: 'ActivityQuestionnaireEdit',
      component: () => import('@/views/activity/questionnaire/edit.vue'),
      meta: {
        title: '问卷设计',
        titleKey: 'route.activityQuestionnaireDesign',
        hidden: true,
        activeMenu: '/activity/questionnaire',
        tagDetailParam: 'id'
      }
    },
    {
      path: 'questionnaire/design/:id',
      redirect: (to) => ({
        name: 'ActivityQuestionnaireEdit',
        params: { id: String(to.params.id) },
        query: to.query
      }),
      meta: { hidden: true }
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
    },
    {
      path: 'parent-student',
      name: 'ActivityParentStudent',
      component: () => import('@/views/activity/parent-student/list.vue'),
      meta: {
        title: '家长学生关联管理',
        titleKey: 'route.activityParentStudent'
      }
    }
  ]
}
