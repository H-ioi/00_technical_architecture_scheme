import Layout from '@/page/index/'

export default [
    {
        path: '/card',
        component: Layout,
        children: [{
            path: '/card/cloud/myclound/index',
            name: '我的名片',
            component: () =>
                import(/* webpackChunkName: "views" */ '@/views/card/cloud/myclound/index')
        },
        ]
    },
]
