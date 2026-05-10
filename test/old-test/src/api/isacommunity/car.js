import request from "@/router/newaxios/axios";
const path = "/isacommunity/buscarinfo";
// 获取校车列表
export function getCarinfoPage (params) {
	return request({
		url: `${path}/getCarinfoPage`,
		method: "get",
		params: {
			...params
		},
	});
}
// 获取校车详情
export function getCarinfoDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
// 新增校车
export function addCarinfo (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}
// 编辑校车
export function editCarinfo (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}
// 删除校车
export function delCarinfo (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}
// 启用禁用
export function batchUpdateStatus (data) {
	return request({
		url: `${path}/batchUpdateStatus`,
		method: "post",
		data,
	});
}
// 导入
export function importCarinfo (data) {
	return request({
		url: `${path}/import`,
		method: "post",
		data,
	});
}
// 下载校车模板
export function downloadCarTemplate () {
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
