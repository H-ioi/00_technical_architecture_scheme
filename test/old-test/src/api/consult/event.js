import request from '@/router/axios'
const path = "/enquiry/event"
// 全部分页
export function getAllEventList (data = {}) {
	return request({
		url: `${path}/getAllEventList`,
		method: 'post',
		data
	})
}
// 分页
export function getEventInfoList (data = {}) {
	return request({
		url: `${path}/getEventList`,
		method: 'post',
		data
	})
}
// 新增
export function addEvent (data = {}) {
	return request({
		url: `${path}/add`,
		method: 'post',
		data
	})
}
// 编辑
export function editEvent (data = {}) {
	return request({
		url: `${path}/edit`,
		method: 'post',
		data
	})
}
// 删除
export function delEvent (data = {}) {
	return request({
		url: `${path}/del`,
		method: 'post',
		data
	})
}
// 获取详情
export function getEventInfo (data = {}) {
	return request({
		url: `${path}/getEventInfo`,
		method: 'post',
		data
	})
}
// 获取评论
export function getComment (data = {}) {
	return request({
		url: `${path}/getComment`,
		method: 'post',
		data
	})
}
// 新增评论
export function addComment (data = {}) {
	return request({
		url: `${path}/addComment`,
		method: 'post',
		data
	})
}
// 获取日程
export function getSchedule (data = {}) {
	return request({
		url: `${path}/getSchedule`,
		method: 'post',
		data
	})
}
