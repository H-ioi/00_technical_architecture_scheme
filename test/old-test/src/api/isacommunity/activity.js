import request from "@/router/newaxios/axios";
const path = "/isacommunity/activity";
//学生家长关联
export function getParentStudent (params) {
	return request({
		url: `${path}/parentstudent/lookupByPhone`,
		method: "get",
		params: {
			...params
		},
	});
}
// 获取活动列表
export function getActivityPage (params) {
	return request({
		url: `${path}/getActivityPage`,
		method: "get",
		params: {
			...params
		},
	});
}
export function getActivityDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
export async function getActivityList () {
	try {
		const res = await request({
			url: `${path}/list`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
export function addActivity (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}
export function editActivity (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}
export function delActivity (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}
export function sendWechatMessage (data) {
	return request({
		url: `${path}/sendWechatMessage`,
		method: "post",
		data
	});
}

