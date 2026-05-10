import request from "@/router/newaxios/axios";
const path = "/isacommunity/activity/questionnaire";
// 获取活动列表
export function getQuestionnairePage (params) {
	return request({
		url: `${path}/getQuestionnairePage`,
		method: "get",
		params: {
			...params
		},
	});
}
export function getQuestionnaireDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
export function exportQuestionnaire (id) {
	return request({
		url: `${path}/export/${id}`,
		method: "get",
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	});
}
export function addQuestionnaire (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}
export function editQuestionnaire (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}
export function copyQuestionnaire (data) {
	return request({
		url: `${path}/copy`,
		method: "post",
		data,
	});
}
export function delQuestionnaire (data) {
	return request({
		url: `${path}/del`,
		method: "delete",
		data,
	});
}
export function editFrozen (data) {
	return request({
		url: `${path}/editFrozen`,
		method: "post",
		data,
	});
}
export function editStatus (data) {
	return request({
		url: `${path}/editStatus`,
		method: "post",
		data,
	});
}
export function signUp (data) {
	return request({
		url: `${path}/signUp`,
		method: "post",
		data,
	});
}
export function viewQuestionnaireDetail (params) {
	return request({
		url: `${path}/view`,
		method: "get",
		params
	});
}

