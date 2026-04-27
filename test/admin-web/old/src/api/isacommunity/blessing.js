import request from "@/router/newaxios/axios";
const path = "/isacommunity/activity/program/blessing";
// 获取祝福列表
export function getBlessingPage (params) {
	return request({
		url: `${path}/getBlessingPage`,
		method: "get",
		params: {
			...params
		},
	});
}
export function getBlessingDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
export function addBlessing (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}
export function editBlessing (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}
export function delBlessing (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}

/** 按活动项目查询祝福语（可选 parentId 过滤） */
export function getBlessingListByProgram (params) {
	return request({
		url: `${path}/listByProgram`,
		method: "get",
		params: {
			...params,
		},
	});
}
