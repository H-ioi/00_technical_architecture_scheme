import Layout from '@/page/index/'

export default [{
  path: '/isa',
  component: Layout,
  children: [
    {
      path: '/isa/home/index',
      name: '首页',
      meta: {
        // keepAlive: true,
        enName: 'Home',
      },
      component: () =>
        import('@/views/isa/home/index.vue')
    },
    // {
    //   path: '/isa/service/search/index',
    //   name: '数据服务',
    //   meta: {
    //     keepAlive: true,
    //   },
    //   component: () =>
    //     import('@/views/isa/service/search/index')
    // },
    // {
    //   path: '/isa/board/science/class/index',
    //   name: '班级看板',
    //   meta: {
    //     keepAlive: true,
    //   },
    //   component: () =>
    //     import('@/views/isa/board/science/class/index')
    // },
    // {
    //   path: '/isa/board/science/student/index',
    //   name: '个人看板',
    //   meta: {
    //     keepAlive: true,
    //   },
    //   component: () =>
    //     import('@/views/isa/board/science/student/index')
    // },
    // {
    //   path: '/isa/board/science/sheet/index',
    //   name: '数据表格',
    //   meta: {
    //     keepAlive: true,
    //   },
    //   component: () =>
    //     import('@/views/isa/board/science/sheet/index')
    // },
    // {
    //   path: '/isa/service/Interface/apply',
    //   name: '接口申请',
    //   meta: {
    //     keepAlive: true,
    //   },
    //   component: () =>
    //     import('@/views/isa/service/Interface/apply')
    // },
    // {
    //   path: '/isa/service/Interface/file',
    //   name: '接口文件',
    //   meta: {
    //     keepAlive: true,
    //   },
    //   component: () =>
    //     import('@/views/isa/service/Interface/file')
    // },
    // {
    //   path: '/isa/service/Interface/subscribe',
    //   name: '接口订阅',
    //   meta: {
    //     keepAlive: true,
    //   },
    //   component: () =>
    //     import('@/views/isa/service/Interface/subscribe')
    // },
    // {
    //   path: '/isa/service/maskingRules/index',
    //   name: '脱敏规则',
    //   meta: {
    //     keepAlive: true,
    //   },
    //   component: () =>
    //     import('@/views/isa/service/maskingRules/index')
    // },
  ]
}]
