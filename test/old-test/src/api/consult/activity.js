import request from '@/router/axios'
const activity = "/enquiry/activity"
// 分页
export function getActivityList (query) {
	return request({
		url: `${activity}/page`,
		method: 'get',
		params: query
	})
}
export function getActivityDetail (id) {
	return request({
		url: `${activity}/get/` + id,
		method: 'get',
	})
}
export function getActivityOpt (query) {
	return request({
		url: `${activity}/opt`,
		method: 'get',
		params: query
	})
}
export function addActivity (data) {
	return request({
		url: `${activity}/add`,
		method: 'post',
		data: data
	})
}
export function editActivity (data) {
	return request({
		url: `${activity}/edit`,
		method: 'put',
		data: data
	})
}
export function delActivity (id) {
	return request({
		url: `${activity}/del/` + id,
		method: 'delete',
	})
}
export function delConfirmActivity (id) {
	return request({
		url: `${activity}/delConfirm/` + id,
		method: 'get',
	})
}
