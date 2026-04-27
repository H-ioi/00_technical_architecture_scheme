import request from '@/router/axios'
const path = "/enquiry/team"
// 全部分页
export function getAllTeamInfoList (data = {}) {
	return request({
		url: `${path}/getAllTeamInfoList`,
		method: 'post',
		data
	})
}
// 分页
export function getTeamInfoList (data = {}) {
	return request({
		url: `${path}/getTeamInfoList`,
		method: 'post',
		data
	})
}
// 新增
export function addTeam (data = {}) {
	return request({
		url: `${path}/add`,
		method: 'post',
		data
	})
}
// 编辑
export function editTeam (data = {}) {
	return request({
		url: `${path}/edit`,
		method: 'post',
		data
	})
}
// 删除
export function delTeam (data = {}) {
	return request({
		url: `${path}/del`,
		method: 'post',
		data
	})
}
// 获取详情
export function getTeamInfo (data = {}) {
	return request({
		url: `${path}/getTeamInfo`,
		method: 'post',
		data
	})
}
// 获取动态
export function getTeamDynamics (data = {}) {
	return request({
		url: `${path}/getTeamDynamics`,
		method: 'post',
		data
	})
}
// 获取进度
export function getTeamProgress (data = {}) {
	return request({
		url: `${path}/getTeamParticipantsProgress`,
		method: 'post',
		data
	})
}
