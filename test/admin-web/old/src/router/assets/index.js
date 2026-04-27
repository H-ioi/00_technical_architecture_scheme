import Layout from '@/page/index/'

export default [{
  path: '/assets',
  component: Layout,
  children: [{
    path: '/assets/list/index',
    name: '资产列表',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/assets/list/index.vue')
  }, {
    path: '/assets/add',
    name: '新增资产',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/assets/assetsfrom')
  }, {
    path: '/assets/edit',
    name: '编辑资产',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/assets/assetsfrom')
  }, {
    path: '/assets/detail',
    name: '资产详情',
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/assets/assetsdetail')
  }, {
    path: '/assets/formgenerator',
    name: '资产类型配置',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/page/space/from/formgenerator')
  }, {
    path: '/assets/type/large/index',
    name: '大类信息',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/assets/type/large/index.vue')
  }, {
    path: '/assets/type/middle/index',
    name: '中类信息',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/assets/type/middle/index.vue')
  }, {
    path: '/assets/type/small/index',
    name: '小类信息',
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/assets/type/small/index.vue')
  }]
}]
