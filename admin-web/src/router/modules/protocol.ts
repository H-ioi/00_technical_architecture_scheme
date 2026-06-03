import type { AppRouteRecord } from '@/types/route'

/** 协议管理（列表 + 隐藏详情） */
export const protocolRoutes: AppRouteRecord[] = [
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
