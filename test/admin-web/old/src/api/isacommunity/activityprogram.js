import request from "@/router/newaxios/axios";
const path = "/isacommunity/activity/program";

// 获取活动项目分页
export function getActivityProgramPage (params) {
	return request({
		url: `${path}/getProgramPage`,
		method: "get",
		params: {
			...params,
		},
	});
}

export function getActivityProgramDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
export function addActivityProgram (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}
export function editActivityProgram (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}
export function delActivityProgram (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}
export function getActivityProgramList (params) {
	return request({
		url: `${path}/list`,
		method: "get",
		params: {
			...params,
		},
	});
}
export async function getActivityProgramlist (params = {}) {
	try {
		const res = await request({
			url: `${path}/list`,
			method: "get",
			params: {
				...params,
			},
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
export async function getProgramDetail (id) {
	try {
		const res = await request({
			url: `${path}/get/${id}`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
export function editActivityProgramStatus (data) {
	return request({
		url: `${path}/editStatus`,
		method: "post",
		data,
	});
}
export function copyActivityProgram (data) {
	return request({
		url: `${path}/copyBatch`,
		method: "post",
		data,
	});
}
