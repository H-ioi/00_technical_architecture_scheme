import request from "@/router/newaxios/axios";
const path = "/isacommunity/activity/program/voteProgram/voteRecord";

// 获取投票记录分页
export function getVoteRecordPage (params) {
	return request({
		url: `${path}/getVoteRecordPage`,
		method: "get",
		params: {
			...params
		},
	});
}

export function getVoteRecordDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
export function addVoteRecord (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}
export function editVoteRecord (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}
export function delVoteRecord (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}
export function getVoteRecordList (params) {
	return request({
		url: `${path}/list`,
		method: "get",
		params: {
			...params
		},
	});
}
export function getVoteRecordlist (params) {
	return request({
		url: `${path}/list`,
		method: "get",
		params: {
			...params
		},
	});
}
