import Layout from '@/page/index/'

export default [
	{
		path: '/',
		redirect: '/redirect', //重定向到空白页在跳转
	},
	{
		path: '/redirect',
		name: 'redirect',
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: true
		},
		component: () =>
			import( /* webpackChunkName: "page" */ '@/page/redirect/index'),
	},
	// {
	//   path: '/',
	//   redirect: '/empty', //重定向到空白页在跳转
	// },
	// {
	//   path: '/empty',
	//   name: 'redirect',
	//   component: () =>
	//     import( /* webpackChunkName: "page" */ '@/page/empty/index'),
	// },
	{
		path: '/login',
		name: 'MOS登录页',
		component: () =>
			import( /* webpackChunkName: "page" */ '@/page/login/index'),
		meta: {
			isLogin: true,
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/loginisa',
		name: 'The pool登录页',
		component: () =>
			import( /* webpackChunkName: "page" */ '@/page/loginisa/index'),
		meta: {
			isLogin: true,
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/logingroup',
		name: '数据平台登录页',
		component: () =>
			import( /* webpackChunkName: "page" */ '@/page/logingroup/index'),
		meta: {
			isLogin: true,
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	}, {
		path: '/loginisacentre',
		name: '科城中心登录页',
		component: () =>
			import( /* webpackChunkName: "page" */ '@/page/loginisacentre/index'),
		meta: {
			isLogin: true,
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/isacommunity/login',
		name: '爱莎圈登录页',
		component: () =>
			import( /* webpackChunkName: "page" */ '@/page/logincommunity/index'),
		meta: {
			isLogin: true,
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/ems/login',
		name: 'EMS教学业务管理系统登录页',
		component: () =>
			import( /* webpackChunkName: "page" */ '@/page/loginems/index'),
		meta: {
			isLogin: true,
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},

	{
		path: '/user',
		component: Layout,
		children: [{
			path: 'index',
			name: '用户管理',
			component: () =>
				import( /* webpackChunkName: "views" */ '@/page/user')
		}]
	},
	{
		path: '/lock',
		name: '锁屏页',
		component: () =>
			import( /* webpackChunkName: "page" */ '@/page/lock/index'),
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/404',
		component: () =>
			import( /* webpackChunkName: "page" */ '@/components/error-page/404'),
		name: '404',
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: true
		}

	},
	{
		path: '/403',
		component: () =>
			import( /* webpackChunkName: "page" */ '@/components/error-page/403'),
		name: '403',
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/500',
		component: () =>
			import( /* webpackChunkName: "page" */ '@/components/error-page/500'),
		name: '500',
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		}
	},
	{
		path: '/thepool/activity/questionnaire',
		name: '收集表',
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		},
		component: () =>
			import( /* webpackChunkName: "page" */ '@/page/thepool/activity/questionnaire/index'),
	},
	{
		path: '/thepool/questionnaire/success',
		name: '提交成功',
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		},
		component: () =>
			import( /* webpackChunkName: "page" */ '@/page/thepool/activity/questionnaire/success'),
	},
	{
		path: '/isacommunity/activity/questionnaire/signup',
		name: '收集表',
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		},
		component: () =>
			import('@/views/isacommunity/activity/questionnaire/signup/index.vue')
	},
	{
		path: '/isacommunity/activity/questionnaire/signup/success',
		name: '提交成功',
		meta: {
			keepAlive: true,
			isTab: false,
			isAuth: false
		},
		component: () =>
			import('@/views/isacommunity/activity/questionnaire/signup/success.vue')
	},
	// {
	//   path: '/',
	//   name: '主页',
	//   redirect: '/user'
	// },
]
