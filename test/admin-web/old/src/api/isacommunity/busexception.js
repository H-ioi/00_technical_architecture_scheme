import request from "@/router/newaxios/axios";
const path = "/isacommunity/busexception";
// 获取异常上报列表
export function getExceptPage (params) {
	return request({
		url: `${path}/getExceptionPage`,
		method: "get",
		params: {
			...params,
		},
	});
}
// 获取异常上报详情
export function getExceptDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
// 新增异常上报
export function addExcept (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}
// 编辑异常上报
export function editExcept (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}
// 删除异常上报
export function delExcept (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}
// 导入
export function importExcept (data) {
	return request({
		url: `${path}/import`,
		method: "post",
		data,
	});
}
// 导出
export function exportExcept (params) {
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
// 下载异常上报模板
export function downloadTemplate () {
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
