import Layout from '@/page/index/'

export default [{
  path: '/order',
  component: Layout,
  children: [{
    path: '/order/list/index',
    name: '工单列表',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/order/list/index')
  },
  {
    path: '/order/mylist/index',
    name: '我的工单',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/order/mylist/index')
  }, {
    path: '/order/servicedetail',
    name: '工单详情',
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/servicedetail')
  },
  {
    path: '/order/carrydetail',
    name: '工单详情',
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/carrydetail')
  },
  {
    path: '/order/addservice',
    name: '新建服务需求',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/addservice')
  },
  {
    path: '/order/editservice',
    name: '编辑服务需求',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/addservice')
  },
  {
    path: '/order/addcarry',
    name: '新建搬运服务',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/addcarry')
  },
  {
    path: '/order/editcarry',
    name: '编辑搬运服务',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/addcarry')
  },
  {
    path: '/order/carry/add',
    name: '新建搬运服务',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/carry/add')
  },
  {
    path: '/order/carry/edit',
    name: '编辑搬运服务',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/carry/edit')
  },
  {
    path: '/order/carry/detail',
    name: '搬运服务详情',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/carry/detail')
  },
  {
    path: '/order/service/add',
    name: '新建服务需求',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/service/add')
  },
  {
    path: '/order/service/edit',
    name: '编辑服务需求',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/service/edit')
  },
  {
    path: '/order/service/detail',
    name: '服务需求详情',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/service/detail')
  },
  {
    path: '/order/upkeep/add',
    name: '新建保养工单',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/upkeep/add')
  },
  {
    path: '/order/upkeep/edit',
    name: '编辑保养工单',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/upkeep/edit')
  },
  {
    path: '/order/upkeep/detail',
    name: '保养工单详情',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/upkeep/detail')
  },
  {
    path: '/order/inspect/add',
    name: '新建巡检工单',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/inspect/add')
  },
  {
    path: '/order/inspect/edit',
    name: '编辑巡检工单',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/inspect/edit')
  },
  {
    path: '/order/inspect/detail',
    name: '巡检工单详情',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/inspect/detail')
  },
  {
    path: '/order/spotcheck/add',
    name: '新建点检工单',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/spotcheck/add')
  },
  {
    path: '/order/spotcheck/edit',
    name: '编辑点检工单',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/spotcheck/edit')
  },
  {
    path: '/order/spotcheck/detail',
    name: '点检工单详情',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/spotcheck/detail')
  },
  {
    path: '/order/repair/add',
    name: '新建维修工单',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/repair/add')
  },
  {
    path: '/order/repair/edit',
    name: '编辑维修工单',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/repair/edit')
  },
  {
    path: '/order/repair/detail',
    name: '维修工单详情',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/repair/detail')
  },
  {
    path: '/order/plan/add',
    name: '新增周期计划',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/plan/form')
  },
  {
    path: '/order/plan/edit',
    name: '编辑周期计划',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/plan/form')
  },
  {
    path: '/order/periodic/plan/index',
    name: '周期计划',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/order/periodic/plan/index')
  },
  {
    path: '/order/plan/detail',
    name: '周期计划详情',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/order/plan/detail')
  },
  ]
},]
