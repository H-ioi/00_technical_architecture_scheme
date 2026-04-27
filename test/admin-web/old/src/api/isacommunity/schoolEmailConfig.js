import request from "@/router/newaxios/axios";

const path = "/isacommunity/schoolEmailConfig";

/** GET …/getEmailConfigPage 分页查询 */
export function getEmailConfigPage (params) {
	return request({
		url: `${path}/getEmailConfigPage`,
		method: "get",
		params: {
			...params,
		},
	});
}

/** GET …/get/{id} 详情 */
export function getSchoolEmailConfigDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}

/** POST …/add */
export function addSchoolEmailConfig (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}

/** POST …/edit */
export function editSchoolEmailConfig (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}

/** DELETE …/del */
export function delSchoolEmailConfig (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}

/** GET …/appModules 应用模块下拉 */
export function getAppModules () {
	return request({
		url: `${path}/appModules`,
		method: "get",
	});
}

/** GET …/list 列表（下拉等） */
export function getSchoolEmailConfigList (params) {
	return request({
		url: `${path}/list`,
		method: "get",
		params: params || {},
	});
}
