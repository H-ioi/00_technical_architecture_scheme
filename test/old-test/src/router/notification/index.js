import Layout from '@/page/index/'

export default [
    {
        path: '/notification',
        component: Layout,
        children: [{
            path: '/notification/list',
            name: '消息列表',
            meta: {
                keepAlive: true,
            },
            component: () =>
                import(/* webpackChunkName: "views" */ '@/views/notification/list/index')
        },
        {
            path: '/notification/detail',
            name: '消息详情',
            meta: {
                keepAlive: true,
            },
            component: () =>
                import(/* webpackChunkName: "views" */ '@/views/notification/detail/index')
        },
        ]
    },
]
