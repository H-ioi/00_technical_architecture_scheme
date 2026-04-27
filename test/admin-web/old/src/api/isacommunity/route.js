import request from "@/router/newaxios/axios";
const path = "/isacommunity/busline"
// 获取路线列表
export function getRoutePage (params) {
	return request({
		url: `${path}/getLinePage`,
		method: "get",
		params: {
			...params
		},
	});
}
// 获取路线详情
export function getRouteDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
// 新增路线
export function addRoute (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data
	});
}
// 编辑路线
export function editRoute (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data
	});
}
// 删除路线
export function delRoute (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params
	});
}
// 复制路线
export function batchCopy (params) {
	return request({
		url: `${path}/batchCopy`,
		method: "get",
		params,
	});
}
// 导入
export function importRoute (data) {
	return request({
		url: `${path}/import`,
		method: "post",
		data,
	});
}
// 下载校车模板
export function downloadRouteTemplate () {
	return request({
		url: `${path}/download`,
		method: 'get',
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	})
}


