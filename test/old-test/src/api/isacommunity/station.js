import request from "@/router/newaxios/axios";
const path = "/isacommunity/busstation"
// 获取站点列表
export function getStationPage (params) {
	return request({
		url: `${path}/getStationPage`,
		method: "get",
		params: {
			...params
		},
	});
}
// 获取站点详情
export function getStationDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
// 新增站点
export function addStation (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data
	});
}
// 编辑站点
export function editStation (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data
	});
}
// 删除站点
export function delStation (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params
	});
}
// 导入
export function importStation (data) {
	return request({
		url: `${path}/import`,
		method: "post",
		data,
	});
}
// 下载校车模板
export function downloadStationTemplate () {
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


