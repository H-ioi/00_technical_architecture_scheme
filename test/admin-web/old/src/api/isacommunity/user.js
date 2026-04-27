import request from "@/router/newaxios/axios";
const path = "/isacommunity/teacher/user";
// 获取跟车老师列表
export function getTeacherPage (params) {
	return request({
		url: `${path}/paginate`,
		method: "get",
		params: {
			...params,
		},
	});
}
// 获取跟车老师详情
export function getTeacherDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
// 新增跟车老师
export function addTeacher (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}
// 编辑跟车老师
export function editTeacher (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}
// 删除跟车老师
export function delTeacher (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}
// 启用禁用
export function batchEnable (data) {
	return request({
		url: `${path}/enable`,
		method: "post",
		params: data,
	});
}
// 启用禁用
export function batchDisabled (data) {
	return request({
		url: `${path}/disable`,
		method: "post",
		params: data,
	});
}
// 导入
export function importTeacher (data) {
	return request({
		url: `${path}/import`,
		method: "post",
		data,
	});
}
// 导出
export function exportTeacher (params) {
	return request({
		url: `${path}/export`,
		method: "get",
		params: {
			...params,
		},
		header: {
			headers: {
				"Content-Type": "application/x-download",
			},
		},
		responseType: "blob",
	});
}
// 下载跟车老师模板
export function downloadCarTemplate () {
	return request({
		url: `${path}/download`,
		method: "get",
		header: {
			headers: {
				"Content-Type": "application/x-download",
			},
		},
		responseType: "blob",
	});
}
