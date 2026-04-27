import request from '@/router/axios'
/**
 * 获取用户数据
 */
export function getEmsUserInfo (params) {
	return request({
		url: `auth/microsoft/auth/token/getUserInfo`,
		method: 'get',
		params: params
	})
}