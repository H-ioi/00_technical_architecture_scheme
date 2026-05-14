import request from "@/router/newaxios/axios";
const path = "/isacommunity/activity/lotteryPoolFile";
// 获取获奖池名单
export function getlotteryPoolFiles (params) {
	return request({
		url: `${path}/listByProgram`,
		method: "get",
		params: {
			...params,
		},
	});
}
export async function getPoolFiles (params) {
	try {
		const res = await request({
			url: `${path}/listByProgram`,
			method: "get",
			params: {
				...params,
			},
		});
		return res.data.data.data;
	} catch (error) {
		throw error;
	}
}
export function downloadPoolFiles () {
	return request({
		url: `${path}/download`,
		method: "get",
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	});
}
export function importLotteryPoolFiles (data) {
	return request({
		url: `${path}/import`,
		method: "post",
		data,
	});
}
export function delLotteryPoolFiles (data) {
	return request({
		url: `${path}/del`,
		method: "post",
		data
	});
}
const listPath = "/isacommunity/activity/lotteryPoolList";
/** 按获奖池分页查询名单（Swagger: GET /activity/lotteryPoolList/listByPool，参数 poolId、current、size） */
export function getLotteryPoolMemberPage (params) {
	const { poolId, current, size } = params || {};
	return request({
		url: `${listPath}/listByPool`,
		method: "get",
		params: {
			poolId,
			current,
			size,
		},
	});
}
