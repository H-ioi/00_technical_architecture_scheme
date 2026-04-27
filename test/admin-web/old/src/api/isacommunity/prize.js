import request from "@/router/newaxios/axios";
const path = "/isacommunity/activity/program/prize";
// 获取奖品列表
export function getPrizePage (params) {
	return request({
		url: `${path}/getPrizePage`,
		method: "get",
		params: {
			...params
		},
	});
}
export function getPrizeDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
export async function getPrizeList () {
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
export function addPrize (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}
export function editPrize (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}
export function delPrize (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}
export async function getProgramPrizeList (params) {
	try {
		const res = await request({
			url: `${path}/listByProgram`,
			method: "get",
			params: {
				...params
			},
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

