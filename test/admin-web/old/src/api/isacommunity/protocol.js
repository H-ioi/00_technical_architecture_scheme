import request from "@/router/newaxios/axios";
const path = "/isacommunity/protocol";
const protocolsign = "/isacommunity/protocolsign";
// 获取协议列表
export function getProtocolPage (params) {
	return request({
		url: `${path}/getProtocolPage`,
		method: "get",
		params: {
			...params
		},
	});
}
export function getProtocolList (params) {
	return request({
		url: `${path}/getProtocolPage`,
		method: "get",
		params: {
			...params
		},
	});
}
// 获取协议类型及所属模块
export async function getProtocolDict () {
	try {
		const res = await request({
			url: `${path}/getDictList`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 获取协议详情
export function getProtocolDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
// 新增协议
export function addProtocol (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}
// 编辑协议
export function editProtocol (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}
// 删除协议
export function delProtocol (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}
// 导入
export function importProtocol (data) {
	return request({
		url: `${path}/import`,
		method: "post",
		data,
	});
}
// 下载协议模板
export function downloadProtocolTemplate () {
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
// 获取协议列表
export function getProtocolSignPage (params) {
	return request({
		url: `${protocolsign}/getProtocolSignPage`,
		method: "get",
		params: {
			...params
		},
	});
}
// 获取协议详情
export function getProtocolSignDetail (id) {
	return request({
		url: `${protocolsign}/get/${id}`,
		method: "get",
	});
}
// 导出
export function exportProtocolSign (params) {
	return request({
		url: `${protocolsign}/export`,
		method: 'get',
		params: {
			...params
		},
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	});
}
