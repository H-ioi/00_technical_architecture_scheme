import request from '@/router/axios'
const path = "/enquiry/clue"
const hybrid = "/enquiry/hybrid"
const guardian = "/enquiry/guardian"
const follow = "/publik/follow/record"
const mineclue = "/enquiry/clue/mine"
const cotice = "/enquiry/notice/config"
const student = "/enquiry/student"

// 获取全部线索列表ids
export async function getClueIds (query = {}) {
	try {
		const res = await request({
			url: `/enquiry/get/clueIds`,
			method: 'post',
			data: query
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 获取全部我的线索列表ids
export async function getMyClueIds (query = {}) {
	try {
		const res = await request({
			url: `/enquiry/get/clueIdsMine`,
			method: 'post',
			data: query
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

// 上传
export function updateFile (data) {
	return request({
		url: `/publik/file/update/outerId`,
		method: 'put',
		data
	})
}
export function getGuardianList (id) {
	return request({
		url: `${guardian}/list/` + id,
		method: 'get',
	})
}
// 新增监护人
export function addGuardian (data, id) {
	return request({
		url: `${guardian}/add/` + id,
		method: 'post',
		data
	})
}
// 编辑监护人
export function editGuardian (data, id) {
	return request({
		url: `${guardian}/edit/` + id,
		method: 'post',
		data
	})
}
// 编辑监护人
export function delGuardian (data) {
	return request({
		url: `${guardian}/del`,
		method: 'delete',
		data
	})
}
export function getClueList (query) {
	return request({
		url: `${path}/paginate`,
		method: 'post',
		data: query
	})
}
// 获取线索下拉框
export async function getClueDropdownList (query) {
	try {
		const res = await request({
			url: `${path}/paginate`,
			method: 'post',
			data: query

		})
		if (res.data.success) {
			return res.data.data.data;
		} else {
			return []
		}

	} catch (error) {
		throw error;
	}
}
export function getMyClueList (query) {
	return request({
		url: `${mineclue}/paginate`,
		method: 'post',
		data: query
	})
}
// 获取学生详情
export function getClueDetail (id) {
	return request({
		url: `${hybrid}/get`,
		method: 'post',
		data: { clueId: id }
	})
}
// 编辑学生详情
export function editStudent (data) {
	return request({
		url: `${hybrid}/edit`,
		method: 'put',
		data
	})
}
// 新增线索综合信息
export function addHybridClue (data) {
	return request({
		url: `${hybrid}/add`,
		method: 'post',
		data
	})
}
// 新增线索
export function addStudentClue (data) {
	return request({
		url: `${path}/add`,
		method: 'post',
		data
	})
}
// 编辑线索
export function editClue (data) {
	return request({
		url: `${path}/edit`,
		method: 'post',
		data
	})
}
// 关闭线索
export function closeStudentClue (data) {
	return request({
		url: `${path}/close`,
		method: 'post',
		data
	})
}
// 入学线索
export function enterStudentClue (data) {
	return request({
		url: `${student}/enter`,
		method: 'put',
		data
	})
}
// 新增记录
export function addlog (data) {
	return request({
		url: `/enquiry/follow/record/add`,
		method: 'post',
		data
	})
}
// 记录列表
export function logList (query) {
	return request({
		url: `${follow}/get/outerId`,
		method: 'get',
		params: query
	})
}
/**
 * 导出
 */
export function exportList (data) {
	return request({
		url: `${path}/export`,
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
 * 导出
 */
export function exportMyList (data) {
	return request({
		url: `${mineclue}/export`,
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
 * 导出
 */
export function exportHybridList (data) {
	return request({
		url: `${hybrid}/export`,
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
 * 导出
 */
export function exportHybridMyList (data) {
	return request({
		url: `${hybrid}/mine/export`,
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
 * 下载模板
 */
export function downloadTemplate (data) {
	return request({
		url: `${path}/template/download`,
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
 * 下载模板
 */
export function downloadHybridTemplate (data) {
	return request({
		url: `${hybrid}/template/download`,
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
 * 导入
 */
export function importList (data) {
	return request({
		url: `${path}/import`,
		method: 'post',
		// header: {
		//   headers: {
		//     "Content-Type": "application/x-download"
		//   }
		// },
		// responseType: "blob",
		data
	})
}
/**
 * 导入
 */
export function importHybridList (data) {
	return request({
		url: `${hybrid}/import`,
		method: 'post',
		// header: {
		// 	headers: {
		// 		"Content-Type": "application/x-download"
		// 	}
		// },
		// responseType: "blob",
		data
	})
}
/**
 * 批量新增跟进人
 */
export function addAssigned (data) {
	return request({
		url: `/enquiry/follow/user/add`,
		method: 'post',
		data
	})
}
/**
 * 编辑跟进人
 */
export function editAssigned (data) {
	return request({
		url: `/enquiry/follow/user/edit`,
		method: 'put',
		data
	})
}
// 编辑学校
export function editSchools (data) {
	return request({
		url: `${path}/school/edit`,
		method: 'post',
		data
	})
}
// 搜索关键词
export function searchKeywords (query) {
	return request({
		url: `${path}/keyword`,
		method: 'get',
		params: query
	})
}
// 通知提醒配置列表
export function getCoticeList (query) {
	return request({
		url: `${cotice}/page`,
		method: 'get',
		params: query
	})
}
// 通知提醒配置详情
export function getCoticeDetail (id) {
	return request({
		url: `${cotice}/get/` + id,
		method: 'get',
	})
}
export function updateCoticeItem (data) {
	return request({
		url: `${cotice}/update`,
		method: 'put',
		data
	})
}
// 入学通知
export function getAdmissionNotice (url) {
	return request({
		url: `enquiry/${student}/admission/template/${url}`,
		method: 'post',
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	})
}
// 关闭线索
export function batchCloseStudentClue (data, clueIds) {
	return request({
		url: `${path}/batch/close`,
		method: 'put',
		params: clueIds,
		data: data,
	})
}
// 批量入学
export function batchEnterStudentClue (data, clueIds) {
	return request({
		url: `${student}/batch/enter` + clueIds,
		method: 'put',
		data: data,
	})
}
// 批量激活线索
export function batchActivateClue (data) {
	return request({
		url: `${path}/batch/activate`,
		method: 'post',
		data: data,
	})
}
// 批量编辑线索
export function batchEditClue (data) {
	return request({
		url: `${path}/batch/edit`,
		method: 'post',
		data: data,
	})
}
// 激活线索
export function activateClue (data) {
	return request({
		url: `${path}/activate`,
		method: 'post',
		data: data,
	})
}
// 线索绑定家长
export function bindGuardianClue (data) {
	return request({
		url: `${path}/guardian/binding/` + data.clueId,
		method: 'post',
		data: data,
	})
}
// 线索绑定学生
export function bindStudentClue (data) {
	return request({
		url: `${path}/student/binding`,
		method: 'post',
		data: data,
	})
}