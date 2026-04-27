import Layout from '@/page/index/'

export default [{
	path: '/isacommunity',
	component: Layout,
	children: [
		{
			path: '/isacommunity/home/index',
			name: '首页',
			meta: {
				enName: 'Home',
			},
			component: () =>
				import('@/views/isacommunity/home/index.vue')
		},
		{
			path: '/isacommunity/member/student/index',
			name: '学生列表',
			meta: {
				enName: 'Student List',
			},
			component: () =>
				import('@/views/isacommunity/member/student/index.vue')
		},
		{
			path: '/isacommunity/member/teacher/index',
			name: '教师列表',
			meta: {
				enName: 'Teacher List',
			},
			component: () =>
				import('@/views/isacommunity/member/teacher/index.vue')
		},
		{
			path: '/isacommunity/member/teacher/detail',
			name: '教师详情',
			meta: {
				enName: 'Teacher Detail',
			},
			component: () =>
				import('@/page/isacommunity/member/teacher/detail.vue')
		},
		{
			path: '/isacommunity/activity/detail/index',
			name: '活动详情',
			meta: {
				enName: 'Activity Detail',
			},
			component: () =>
				import('@/views/isacommunity/activity/list/detail/index.vue')
		},
		{
			path: '/isacommunity/activity/program/detail/index',
			name: '活动项目详情',
			meta: {
				enName: 'Activity Program Detail',
			},
			component: () =>
				import('@/views/isacommunity/activity/program/detail/index.vue')
		},
		{
			path: '/isacommunity/activity/questionnaire/form',
			name: '问卷表单',
			meta: {
				enName: 'Questionnaire Form',
			},
			component: () =>
				import('@/views/isacommunity/activity/questionnaire/templateform.vue')
		},
		{
			path: '/isacommunity/activity/questionnaire/templateresult',
			name: '问卷表单',
			meta: {
				enName: 'Questionnaire Form',
			},
			component: () =>
				import('@/views/isacommunity/activity/questionnaire/templateresult.vue')
		},

	{
			path: '/isacommunity/attendance/holiday/flow',
			name: '请假流程',
			meta: {
				enName: 'Holiday Flo2w',
			},
			component: () =>
				import('@/views/isacommunity/attendance/holiday/flow.vue')
		},


				{
			path: '/isacommunity/attendance/holiday/flow/add',
			name: '新增请假流程',
			meta: {
				enName: 'Holiday Flow',
			},
			component: () =>
				import('@/views/isacommunity/attendance/holiday/flowdesign.vue')
		},


			{
			path: '/isacommunity/attendance/holiday/flow/:id',
			name: '请假流程详情',
			meta: {
				enName: 'Holiday Flow',
			},
			component: () =>
				import('@/views/isacommunity/attendance/holiday/flowdesign.vue')
		},

	]
}]
