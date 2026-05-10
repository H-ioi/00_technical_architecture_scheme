import request from '@/router/axios'
const path = "/enquiry/task"
// 全部分页
export function getAllTaskInfoList (data = {}) {
	return request({
		url: `${path}/getAllTaskInfoList`,
		method: 'post',
		data
	})
}
// 分页
export function getTaskInfoList (data = {}) {
	return request({
		url: `${path}/getTaskInfoList`,
		method: 'post',
		data
	})
}
// 新增
export function addTask (data = {}) {
	return request({
		url: `${path}/add`,
		method: 'post',
		data
	})
}
// 编辑
export function editTask (data = {}) {
	return request({
		url: `${path}/edit`,
		method: 'post',
		data
	})
}
// 删除
export function delTask (data = {}) {
	return request({
		url: `${path}/del`,
		method: 'post',
		data
	})
}
// 获取详情
export function getTaskInfo (data = {}) {
	return request({
		url: `${path}/getTaskInfo`,
		method: 'post',
		data
	})
}
// 新增任务评论
export function addComment (data = {}) {
	return request({
		url: `${path}/addComment`,
		method: 'post',
		data
	})
}
// 新增任务完成
export function addComplete (data = {}) {
	return request({
		url: `${path}/addComplete`,
		method: 'post',
		data
	})
}
// 新增任务总结
export function addSummary (data = {}) {
	return request({
		url: `${path}/addSummary`,
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
// 任务看板
export function getTaskBoard (data = {}) {
	return request({
		url: `${path}/getTaskBoard`,
		method: 'post',
		data
	})
}

