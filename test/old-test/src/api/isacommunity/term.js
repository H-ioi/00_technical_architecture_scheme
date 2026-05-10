import request from "@/router/newaxios/axios";
const path = "/isacommunity/bussection";
// 获取学期列表
export function getTermPage (params) {
	return request({
		url: `${path}/getSectionPage`,
		method: "get",
		params: {
			...params
		},
	});
}
// 获取学期详情
export function getTermDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
// 新增学期
export function addTerm (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}
// 编辑学期
export function editTerm (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}
// 删除学期
export function delTerm (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}
