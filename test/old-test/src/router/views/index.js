import Layout from '@/page/index/'

export default [{
  path: '/info',
  component: Layout,
  children: [{
    path: 'index',
    name: '修改密码',
    meta: {
      keepAlive: true
    },
    component: () =>
      import(/* webpackChunkName: "page" */ '@/views/admin/user/info')
  }]
},
]
