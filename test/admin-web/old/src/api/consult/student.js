import request from '@/router/axios'
const student = "/enquiry/student"
const guardian = "/enquiry/guardian"
// 获取全部家长列表ids
export async function getGuardianIds (query = {}) {
	try {
		const res = await request({
			url: `/enquiry/guardian/get/guardianIds`,
			method: 'post',
			data: query
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 获取全部我的家长列表ids
export async function getMyGuardianIds (query = {}) {
	try {
		const res = await request({
			url: `/enquiry/guardian/get/guardianIdsMine`,
			method: 'post',
			data: query
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 查询升学列表
export function getStudentUpgrade (data) {
	console.log('getStudentUpgrade', data);
	return request({
		url: `${student}/list/upgrade`,
		method: 'post',
		data: data
	})
}
// 回退升学状态
export function rollbackStudent (data) {
	return request({
		url: `${student}/rollback/upgrade`,
		method: 'post',
		data: data
	})
}
// 一键升学状态
export function batchUpgradeStudent (data) {
	return request({
		url: `${student}/batch/upgrade`,
		method: 'post',
		data: data
	})
}
// 学生管理分页
export function getStudentList (query) {
	return request({
		url: `${student}/paginate`,
		method: 'post',
		data: query
	})
}
// 我的学生分页
export function getMyStudentList (query) {
	return request({
		url: `${student}/mine/paginate`,
		method: 'post',
		data: query
	})
}
// 学生关联线索
export function getStudentClue (query) {
	return request({
		url: `${student}/list/clue`,
		method: 'post',
		data: query
	})
}
// 学生关联家长
export function getStudentGuardian (query) {
	return request({
		url: `${student}/list/guardian`,
		method: 'post',
		data: query
	})
}
// 新增学生
export function addStudent (data) {
	return request({
		url: `${student}/add`,
		method: 'post',
		data
	})
}
// 编辑学生
export function editStudent (data) {
	return request({
		url: `${student}/edit`,
		method: 'post',
		data
	})
}
// 批量编辑学生
export function batchEditStudent (data) {
	return request({
		url: `${student}/batch/edit`,
		method: 'post',
		data
	})
}
// 学生详情
export function getStudentDetail (id) {
	return request({
		url: `${student}/get`,
		method: 'post',
		data: { id }
	})
}
// 批量导入学生
export function batchStudent (data) {
	return request({
		url: `${student}/import`,
		method: 'post',
		data
	})
}
// 绑定监护人
export function bindGuardian (data) {
	return request({
		url: `${student}/guardian/binding`,
		method: 'post',
		data
	})
}
// 删除学生
export function delStudent (id) {
	return request({
		url: `${student}/del`,
		method: 'post',
		data: { studentId: id }
	})
}
// 入学
export function enterStudent (data) {
	return request({
		url: `${student}/enter`,
		method: 'post',
		data: data
	})
}
// 批量入学
export function batchEnterStudent (data) {
	return request({
		url: `${student}/enter`,
		method: 'post',
		data: data
	})
}
// 批量申请
export function batchApplyStudent (data) {
	return request({
		url: `${student}/apply`,
		method: 'post',
		data: data
	})
}
// 离校
export function leaveStudent (data) {
	return request({
		url: `${student}/leaving`,
		method: 'post',
		data
	})
}
// 批量离校
export function batchLeaveStudent (data) {
	return request({
		url: `${student}/leaving`,
		method: 'post',
		data: data
	})
}
// 批量毕业
export function batchGraduationStudent (data) {
	return request({
		url: `${student}/graduated`,
		method: 'post',
		data: data
	})
}
// 入学通知
export function getAdmissionNotice (url) {
	return request({
		url: `${student}/admission/template/${url}`,
		method: 'post',
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	})
}
/**
 * 下载导入学生模板
 */
export function downloadStudentTemplate (data) {
	return request({
		url: `${student}/download`,
		method: 'get',
		params: {
			...data
		},
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	})
}
/**
 * 导出学生
 */
export function exportStudentList (data) {
	return request({
		url: `${student}/export`,
		method: 'post',
		data,
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	})
}
/**
 * 导出学生
 */
export function exportMyStudentList (data) {
	return request({
		url: `${student}/mine/export`,
		method: 'post',
		data,
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	})
}
// 修改学生归属校区
export function changeStudentShcool (data) {
	return request({
		url: `${student}/shcool/edit`,
		method: 'post',
		data: data
	})
}
// 修改家长归属校区
export function changeGuardianShcool (data) {
	return request({
		url: `${guardian}/shcool/edit`,
		method: 'post',
		data: data
	})
}
// 家长管理分页
export function getGuardianList (data) {
	return request({
		url: `${guardian}/paginate`,
		method: 'post',
		data
	})
}
// 我的家长分页
export function getMyGuardianList (data) {
	return request({
		url: `${guardian}/mine/paginate`,
		method: 'post',
		data
	})
}
// 家长关联线索
export function getGuardianClue (query) {
	return request({
		url: `${guardian}/list/clue`,
		method: 'post',
		data: query
	})
}
// 学生关联家长
export function getGuardianStudent (query) {
	return request({
		url: `${guardian}/list/student`,
		method: 'post',
		data: query
	})
}
// 新增家长
export function addGuardian (data) {
	return request({
		url: `${guardian}/add`,
		method: 'post',
		data
	})
}
// 编辑家长
export function editGuardian (data) {
	return request({
		url: `${guardian}/edit`,
		method: 'post',
		data
	})
}
// 家长详情
export function getGuardianDetail (id) {
	return request({
		url: `${guardian}/get`,
		method: 'post',
		data: { id }
	})
}
// 批量导入家长
export function batchGuardian (data) {
	return request({
		url: `${guardian}/import`,
		method: 'post',
		data
	})
}
// 删除家长
export function delGuardian (id) {
	return request({
		url: `${guardian}/del?id=${id}`,
		method: 'delete',

	})
}
/**
 * 下载导入家长模板
 */
export function downloadGuardianTemplate () {
	return request({
		url: `${guardian}/download`,
		method: 'get',
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	})
}
/**
 * 导出家长
 */
export function exportGuardianList (data) {
	return request({
		url: `${guardian}/export`,
		method: 'post',
		data,
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	})
}
/**
 * 导出我的家长
 */
export function exportMyGuardianList (data) {
	return request({
		url: `${guardian}/mine/export`,
		method: 'post',
		data,
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	})
}
