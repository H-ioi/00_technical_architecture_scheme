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
export function sendWechatMessage (activityId) {
	return request({
		url: `${path}/sendWechatMessage`,
		method: "post",
		params: {
			activityId,
		},
	});
}

export function sendWechatMessageTest (activityId) {
	return request({
		url: `${path}/sendWechatMessageTest`,
		method: "post",
		params: {
			activityId,
		},
	});
}

/** 下载活动可见范围 Excel 模板 */
export function downloadVisibleScopeTemplate () {
	return request({
		url: `${path}/visibleScopeFile/download`,
		method: "get",
		responseType: "blob",
	});
}

/**
 * 导入活动可见范围名单
 * @param {string|number} activityId
 * @param {File} file
 */
export function importVisibleScopeFile (activityId, file) {
	const formData = new FormData();
	formData.append("file", file);
	return request({
		url: `${path}/visibleScopeFile/import`,
		method: "post",
		params: { activityId },
		data: formData,
	});
}

const ticketPath = `${path}/ticket`;

/** 购票记录分页（报名人数） */
export function getActivityTicketPage (params) {
	return request({
		url: `${ticketPath}/getPage`,
		method: "get",
		params: {
			...params,
		},
	});
}

export function getActivityTicketDetail (id) {
	return request({
		url: `${ticketPath}/get/${id}`,
		method: "get",
	});
}

export function addActivityTicket (data) {
	return request({
		url: `${ticketPath}/add`,
		method: "post",
		data,
	});
}

export function editActivityTicket (data) {
	return request({
		url: `${ticketPath}/edit`,
		method: "post",
		data,
	});
}

export function delActivityTicket (params) {
	return request({
		url: `${ticketPath}/del`,
		method: "delete",
		params,
	});
}

/** 下载导入模板 */
export function downloadActivityTicketTemplate () {
	return request({
		url: `${ticketPath}/download`,
		method: "get",
		responseType: "blob",
	});
}

/**
 * 导入购票记录（报名导入）
 * POST `/activity/ticket/import`：仅 formData 字段 `file`；请求头 `VERSION`
 */
export function importActivityTicket (file) {
	const formData = new FormData();
	formData.append("file", file);
	return request({
		url: `${ticketPath}/import`,
		method: "post",
		data: formData,
		headers: {
			VERSION: "B",
		},
	});
}

const checkinPath = `${path}/checkin`;

/** 签到记录分页（签到人数） GET /activity/checkin/getPage */
export function getActivityCheckinPage (params) {
	return request({
		url: `${checkinPath}/getPage`,
		method: "get",
		params: {
			...params,
		},
	});
}

/** 更新签到记录 */
export function editActivityCheckin (data) {
	return request({
		url: `${checkinPath}/edit`,
		method: "post",
		data,
	});
}

