import request from "@/router/newaxios/axios";

const path = "/isacommunity/wechatSchoolInfo";

/** 分页查询配置 GET …/getWechatInfoPage */
export function getWechatInfoPage (params) {
	return request({
		url: `${path}/getWechatInfoPage`,
		method: "get",
		params: {
			...params,
		},
	});
}

/** @deprecated 请使用 getWechatInfoPage */
export const getwechatSchoolPage = getWechatInfoPage;

/** 详情 GET …/get/{id} */
export function getWechatSchoolDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}

/** POST …/add */
export function addWechatSchoolInfo (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}

/** POST …/edit */
export function editWechatSchoolInfo (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}

/** DELETE …/del */
export function delWechatSchoolInfo (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}

export const addwechatSchool = addWechatSchoolInfo;
export const editwechatSchool = editWechatSchoolInfo;
export const delwechatSchool = delWechatSchoolInfo;
