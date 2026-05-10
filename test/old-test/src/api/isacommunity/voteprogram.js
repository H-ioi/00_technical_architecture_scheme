import request from "@/router/newaxios/axios";
const path = "/isacommunity/activity/program/voteProgram";
// 获取投票列表
export function getVoteProgramPage (params) {
	return request({
		url: `${path}/getVoteProgramPage`,
		method: "get",
		params: {
			...params
		},
	});
}

export function getVoteProgramDetail (id) {
	return request({
		url: `${path}/get/${id}`,
		method: "get",
	});
}
export function addVoteProgram (data) {
	return request({
		url: `${path}/add`,
		method: "post",
		data,
	});
}
export function editVoteProgram (data) {
	return request({
		url: `${path}/edit`,
		method: "post",
		data,
	});
}
export function delVoteProgram (params) {
	return request({
		url: `${path}/del`,
		method: "delete",
		params,
	});
}
export function getVoteProgramList (params) {
	return request({
		url: `${path}/list`,
		method: "get",
		params: {
			...params
		},
	});
}
export async function getVoteProgram (params) {
	try {
		const res = await request({
			url: `${path}/list`,
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
