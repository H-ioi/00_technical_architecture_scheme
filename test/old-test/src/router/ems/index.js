import Layout from '@/page/index/'

export default [{
	path: '/ems',
	component: Layout,
	children: [
		{
			path: '/ems/home/index',
			name: '首页',
			meta: {
				keepAlive: true,
				enName: 'Home',
			},
			component: () =>
				import('@/views/ems/home/index.vue')
		},
	]
}]
