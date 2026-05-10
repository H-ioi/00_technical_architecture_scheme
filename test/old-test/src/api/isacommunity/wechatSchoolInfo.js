import request from "@/router/newaxios/axios";
const path = "/isacommunity/wechatSchoolInfo";
// 获取学校微信列表
export function getwechatSchoolPage (params) {
	return request({
		url: `${path}/getwechatSchoolPage`,
		method: "get",
		params: {
			...params
		},
	});
}
export function getwechatSchoolDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
export async function getwechatSchoolList () {
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
export function addwechatSchool (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}
export function editwechatSchool (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}
export function delwechatSchool (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}

