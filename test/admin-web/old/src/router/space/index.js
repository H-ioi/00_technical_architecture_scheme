import Layout from '@/page/index/'

export default [{
  path: '/space',
  component: Layout,
  children: [{
      path: '/space/board/index',
      name: '空间看板',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/space/board/index')
    },
    {
      path: '/space/list/index',
      name: '空间列表',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/space/list/index')
    },
    {
      path: '/space/attribute/type/index',
      name: '空间类型管理',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/space/attribute/type/index')
    },
    {
      path: '/space/reservation/index',
      name: '预定列表',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/space/reservation/index')
    },
    {
      path: '/space/attribute/level/index',
      name: '层级信息配置',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/space/attribute/level/index')
    },
    {
      path: '/spacetype/formgenerator',
      name: '空间类型配置',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/space/from/formgenerator')
    },
    {
      path: '/space/attribute/label/index',
      name: '空间标签配置',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/space/attribute/label/index')
    },
    {
      path: '/spacelevel/formgenerator',
      name: '层级信息配置',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/space/from/formgenerator')
    },
    {
      path: '/space/fullcalendar',
      name: '日历',
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/space/fullcalendar/index')
    },
    {
      path: '/space/boarddetail',
      name: '空间详情',
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/space/boarddetail')
    },
    {
      path: '/space/detail',
      name: '空间详情',
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/space/boarddetail')
    },
    {
      path: '/space/reservation',
      name: '预定管理看板',
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/space/reservation')
    },
    {
      path: '/space/usereservation',
      name: '使用管理看板',
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/space/usereservation')
    },
    {
      path: '/space/add',
      name: '新建空间',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/space/spacefrom')
    },
    {
      path: '/space/edit',
      name: '编辑空间',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/space/spacefrom')
    },
    {
      path: '/space/report/index',
      name: '空间简报',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/space/report/index')
    },
  ]
}]
