import Layout from '@/page/index/'

export default [{
  path: '/academy',
  component: Layout,
  children: [
    {
      path: '/academy/course/course',
      name: '课程列表',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/academy/course/course')
    },
    {
      path: '/academy/course/activity',
      name: '活动列表',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/academy/course/activity')
    },
    {
      path: '/academy/course/competition',
      name: '赛事列表',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/academy/course/competition')
    },
    {
      path: '/academy/course/club',
      name: '俱乐部列表',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/academy/course/club')
    },
    {
      path: '/academy/user/club',
      name: '家长列表',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/academy/user/parent')
    },
    {
      path: '/academy/user/club',
      name: '学生列表',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/academy/user/student')
    },
    {
      path: '/academy/order/list',
      name: '订单列表',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/academy/order/list')
    },
    {
      path: '/academy/order/refund',
      name: '退费订单',
      meta: {
        keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/academy/order/refund')
    },
    {
      path: '/academy/consult/editswiper',
      name: '轮播图',
      meta: {
        // keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/academy/consult/editswiper')
    },
    {
      path: '/academy/consult/swiperdetail',
      name: '轮播图详情',
      meta: {
        // keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/academy/consult/swiperdetail')
    },
    {
      path: '/academy/course/editactivity',
      name: '活动',
      meta: {
        // keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/academy/course/editactivity')
    },
    {
      path: '/academy/course/editcourse',
      name: '课程',
      meta: {
        // keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/academy/course/editcourse')
    },
    {
      path: '/academy/course/coursedetail',
      name: '详情',
      meta: {
        // keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/academy/course/coursedetail')
    },
    {
      path: '/academy/course/editcompetition',
      name: '赛事',
      meta: {
        // keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/academy/course/editcompetition')
    },
    {
      path: '/academy/course/editclub',
      name: '俱乐部',
      meta: {
        // keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/academy/course/editclub')
    },
    {
      path: '/academy/order/detail',
      name: '订单详情',
      meta: {
        // keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/academy/order/detail')
    },
    {
      path: '/academy/user/studentdetail',
      name: '学生详情',
      meta: {
        // keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/academy/user/studentdetail')
    },
    {
      path: '/academy/user/parentdetail',
      name: '家长详情',
      meta: {
        // keepAlive: true,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/page/academy/user/parentdetail')
    },
  ]
},]
