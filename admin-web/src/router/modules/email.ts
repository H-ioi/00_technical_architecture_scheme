import type { AppRouteRecord } from '@/types/route'

/** 群发邮件 */
export const emailRoute: AppRouteRecord = {
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
}
