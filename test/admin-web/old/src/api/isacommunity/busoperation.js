import request from "@/router/newaxios/axios";
const path = "/isacommunity/busoperation";
// 获取校车运营列表
export function getOperationPage (params) {
	return request({
		url: `${path}/getOperationPage`,
		method: "get",
		params: {
			...params,
		},
	});
}
// 获取校车运营详情
export function getOperationDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
// 新增校车运营
export function addOperation (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}
// 编辑校车运营
export function editOperation (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}
// 删除校车运营
export function delOperation (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}
// 导入
export function importOperation (data) {
	return request({
		url: `${path}/import`,
		method: "post",
		data,
	});
}
// 导出
export function exportOperation (params) {
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
// 下载校车运营模板
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
