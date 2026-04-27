export default {
	title: '运营管理系统',
	subtitle: 'OMS',
	copyright: 'Copyright © 2021. All rights reserved.',
	isFirstPage: true,// 配置首页不可关闭
	key: 'uni', // 配置主键,目前用于存储
	whiteList: ['/login', '/404', '/401', '/lock', '/redirect'], // 配置无权限可以访问的页面
	whiteTagList: ['/login', '/404', '/401', '/lock', '/redirect'], // 配置不添加tags页面 （'/advanced-router/mutative-detail/*'——*为通配符）
	fistPage: {
		label: '用户管理',
		value: '/user/index',
		params: {},
		query: {},
		group: [],
		close: false
	},
	// 配置菜单的属性
	menu: {
		props: {
			label: 'label',
			path: 'path',
			icon: 'icon',
			children: 'children'
		}
	},
	system: {
		1: 'OMS-运营管理系统',
		2: 'The Pool',
		3: '爱莎数据库',
		4: '爱莎科创中心',
		5: '爱莎圈',
		6: 'EMS',
	},
	systemLogo: {
		1: '运营管理系统',
		2: 'The Pool',
		3: '爱莎数据库',
		4: '爱莎科创中心',
		5: 'ISA Community',
		6: 'EMS',
	},
	systemFistPage: {
		1: {
			label: '我的工单',
			value: '/order/mylist/index?status=2',
			params: {},
			query: {},
			group: [],
			close: false
		},
		2: {
			label: '我的咨询',
			value: '/thepool/enquiry/my/index',
			params: {},
			query: {},
			group: [],
			close: false
		},
		3: {
			label: '首页',
			value: '/isa/home/index',
			params: {},
			query: {},
			group: [],
			close: false
		},
		4: {
			label: '课程',
			value: '/academy/course/course',
			params: {},
			query: {},
			group: [],
			close: false
		},
		5: {
			label: '首页',
			value: '/isacommunity/home/index',
			params: {},
			query: {},
			group: [],
			close: false
		},
		6: {
			label: '首页',
			value: '/ems/home/index',
			params: {},
			query: {},
			group: [],
			close: false
		},
	}
}
