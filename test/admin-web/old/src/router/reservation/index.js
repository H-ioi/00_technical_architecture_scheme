import Layout from '@/page/index/'

export default [{
  path: '/reservation',
  component: Layout,
  children: [
    {
      path: '/reservation/list/index',
      name: '预定列表',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/reservation/list/index')
    },
    {
      path: '/reservation/fullcalendar/index',
      name: '预定看板',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/reservation/fullcalendar/index')
    },
    {
      path: '/reservation/uselist/index',
      name: '使用列表',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/reservation/uselist/index')
    },
    {
      path: '/reservation/usefullcalendar/index',
      name: '使用看板',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/reservation/usefullcalendar/index')
    },
  ]
}]
