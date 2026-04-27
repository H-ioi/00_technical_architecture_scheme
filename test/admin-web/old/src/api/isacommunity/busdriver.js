import request from "@/router/newaxios/axios";
const path = "/isacommunity/busdriver";
// 获取司机列表
export function getBusdriverPage (params) {
	return request({
		url: `${path}/getDriverPage`,
		method: "get",
		params: {
			...params
		},
	});
}
// 获取司机详情-工号
export function getByEmployeeNo (id) {
	return request({
		url: `${path}/getByEmployeeNo/${id}`,
		method: "get",
	});
}
// 获取司机详情
export function getBusdriverDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
// 新增司机
export function addBusdriver (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}
// 编辑司机
export function editBusdriver (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}
// 删除司机
export function delBusdriver (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}
// 导入
export function importBusdriver (data) {
	return request({
		url: `${path}/import`,
		method: "post",
		data,
	});
}
// 下载司机模板
export function downloadDriverTemplate () {
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
