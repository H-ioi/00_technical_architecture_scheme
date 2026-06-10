import type { AppRouteRecord } from '@/types/route'

/** 宿舍管理 */
export const dormRoute: AppRouteRecord = {
  path: 'dorm',
  name: 'Dorm',
  redirect: '/dorm/space/building',
  meta: {
    title: '宿舍管理',
    titleKey: 'route.dorm',
    icon: 'OfficeBuilding'
  },
  children: [
    {
      path: 'space',
      name: 'DormSpace',
      redirect: '/dorm/space/building',
      meta: {
        title: '空间管理',
        titleKey: 'route.dormSpace'
      },
      children: [
        {
          path: 'building',
          name: 'DormBuilding',
          component: () => import('@/views/dorm/space/building/list.vue'),
          meta: {
            title: '楼栋管理',
            titleKey: 'route.dormBuilding'
          }
        },
        {
          path: 'floor',
          name: 'DormFloor',
          component: () => import('@/views/dorm/space/floor/list.vue'),
          meta: {
            title: '楼层管理',
            titleKey: 'route.dormFloor'
          }
        },
        {
          path: 'room',
          name: 'DormRoom',
          component: () => import('@/views/dorm/space/room/list.vue'),
          meta: {
            title: '房间管理',
            titleKey: 'route.dormRoom'
          }
        },
        {
          path: 'room-assign/:id',
          name: 'DormRoomAssign',
          component: () => import('@/views/dorm/space/room-assign/index.vue'),
          meta: {
            title: '床位分配',
            titleKey: 'route.dormRoomAssign',
            hidden: true,
            activeMenu: '/dorm/space/room',
            tagDetailParam: 'id'
          }
        },
        {
          path: 'attribute',
          name: 'DormAttribute',
          component: () => import('@/views/dorm/space/attribute/list.vue'),
          meta: {
            title: '属性管理',
            titleKey: 'route.dormAttribute'
          }
        },
        {
          path: 'rule',
          name: 'DormRule',
          component: () => import('@/views/dorm/space/rule/list.vue'),
          meta: {
            title: '自动分配规则',
            titleKey: 'route.dormRule'
          }
        }
      ]
    },
    {
      path: 'boarding-student',
      name: 'DormBoardingStudent',
      component: () => import('@/views/dorm/boarding-student/tab.vue'),
      meta: {
        title: '住宿生管理',
        titleKey: 'route.dormBoardingStudent'
      }
    }
  ]
}
