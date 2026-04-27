import request from "@/router/newaxios/axios";
const path = "/isacommunity/busorder"
// 获取意向订单分页
export function getIntentionOrderPage (params) {
	return request({
		url: `${path}/getIntentionOrderPage`,
		method: "get",
		params
	});
}
// 获取订单分页
export function getOrderPage (params) {
	return request({
		url: `${path}/getOrderPage`,
		method: "get",
		params
	});
}
// 获取意向订单详情
export function getOrderDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
// 新增订单
export function addOrder (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data
	});
}
// 编辑订单
export function editOrder (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data
	});
}
// 删除意向订单
export function delIntentionOrder (params) {
	return request({
		url: `${path}/delIntentionOrder`,
		method: "delete",
		params
	});
}
// 批量同意申请订单
export function batchApprove (params) {
	return request({
		url: `${path}/batchApprove`,
		method: "get",
		params
	});
}
// 批量拒绝申请订单
export function batchDeny (params) {
	return request({
		url: `${path}/batchDeny`,
		method: "get",
		params
	});
}
// 删除订单
export function delOrder (params) {
	return request({
		url: `${path}/delOrder`,
		method: "delete",
		params
	});
}

//批量更改订单为已缴费状态
export function batchUpdatePaymentStatus (params) {
	return request({
		url: `${path}/batchUpdatePaymentStatus`,
		method: "get",
		params
	});
}
// 获取学生列表精准查询
export function getStudentInfo (params) {
	return request({
		url: `${path}/getStudentInfo`,
		method: "get",
		params
	});
}
// 获取学生列表模糊查询
export function getStudentInfoList (params) {
	return request({
		url: `${path}/getStudentInfoList`,
		method: "get",
		params
	});
}
// 根据路线ID和站点ID查询价格
export async function getLineStationPrice (data) {
	try {
		const res = await request({
			url: `${path}/getLineStationPrice`,
			method: "post",
			data
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 导入意向乘车学生
export function importIntentionOrder (data) {
	return request({
		url: `${path}/importIntentionOrder`,
		method: "post",
		data,
	});
}
// 下载意向乘车学生模版
export function downloadIntentionOrder () {
	return request({
		url: `${path}/downloadIntentionOrder`,
		method: 'get',
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	})
}
// 导入乘车学生
export function importOrder (data) {
	return request({
		url: `${path}/importOrder`,
		method: "post",
		data,
	});
}
// 下载乘车学生模版
export function downloadOrder () {
	return request({
		url: `${path}/downloadOrder`,
		method: 'get',
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	})
}
// 导出正式订单
export function exportOrder (params) {
	return request({
		url: `${path}/exportOrder`,
		method: "get",
		params,
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	});
}


