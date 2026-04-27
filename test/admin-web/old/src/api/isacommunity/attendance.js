import request from "@/router/newaxios/axios";
const attendance = "/isacommunity/attendance";
const common = "/isacommunity/attendance/common";
// 获取校区
export async function getSchoolList () {
	try {
		const res = await request({
			url: `${common}/getSchoolList`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 获取部门列表
export async function getDepartmentList () {
	try {
		const res = await request({
			url: `${common}/getDepartmentList`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 获取年级
export async function getGradeList () {
	try {
		const res = await request({
			url: `${common}/getGradeList`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 获取门禁记录分页
export function getAttendanceStudentPage (params) {
	return request({
		url: `${attendance}/student/page`,
		method: "get",
		params: {
			...params,
		},
	});
}
// 获取门禁记录详情
export function getAttendanceStudentDetail (id) {
	return request({
		url: `${attendance}/student/detail/${id}`,
		method: "get",
	});
}
// 导出门禁记录详情
export function exportAttendanceStudent (params) {
	return request({
		url: `${attendance}/student/export`,
		method: "get",
		params: {
			...params,
		},
		header: {
			headers: {
				"Content-Type": "application/x-download",
			},
		},
		responseType: "blob",
	});
}
// 获取门禁记录分页
export function getAccessRecordPage (params) {
	return request({
		url: `${attendance}/union/page`,
		method: "get",
		params: {
			...params,
		},
	});
}
// 获取门禁记录详情
export function getAccessRecordDetail (id) {
	return request({
		url: `${attendance}/union/detail/${id}`,
		method: "get",
	});
}
// 导出门禁记录详情
export function exportAccessRecord (params) {
	return request({
		url: `${attendance}/union/export`,
		method: "get",
		params: {
			...params,
		},
		header: {
			headers: {
				"Content-Type": "application/x-download",
			},
		},
		responseType: "blob",
	});
}
// 获取校园考勤分页
export function getSchoolAttendancePage (params) {
	return request({
		url: `${attendance}/school/page`,
		method: "get",
		params: {
			...params,
		},
	});
}
// 获取校园考勤详情
export function getSchoolAttendanceDetail (id) {
	return request({
		url: `${attendance}/school/detail/${id}`,
		method: "get",
	});
}
// 导出校园考勤
export function exportSchoolAttendance (params) {
	return request({
		url: `${attendance}/school/export`,
		method: "get",
		params: {
			...params,
		},
		header: {
			headers: {
				"Content-Type": "application/x-download",
			},
		},
		responseType: "blob",
	});
}
// 获取微信通知分页
export function getWechatNoticePage (params) {
	return request({
		url: `${attendance}/wechatNotice/page`,
		method: "get",
		params: {
			...params,
		},
	});
}
// 获取微信通知详情
export function getWechatNoticeDetail (id) {
	return request({
		url: `${attendance}/wechatNotice/detail/${id}`,
		method: "get",
	});
}
// 导出微信通知
export function exportWechatNotice (params) {
	return request({
		url: `${attendance}/wechatNotice/export`,
		method: "get",
		params: {
			...params,
		},
		header: {
			headers: {
				"Content-Type": "application/x-download",
			},
		},
		responseType: "blob",
	});
}
// 获取微信Openid分页
export function getWechatOpenidPage (params) {
	return request({
		url: `${attendance}/wechatOpenid/page`,
		method: "get",
		params: {
			...params,
		},
	});
}
// 获取微信Openid详情
export function getWechatOpenidDetail (id) {
	return request({
		url: `${attendance}/wechatOpenid/detail/${id}`,
		method: "get",
	});
}
// 导出微信Openid
export function exportWechatOpenid (params) {
	return request({
		url: `${attendance}/wechatOpenid/export`,
		method: "get",
		params: {
			...params,
		},
		header: {
			headers: {
				"Content-Type": "application/x-download",
			},
		},
		responseType: "blob",
	});
}
// 更新状态
export function updateWechatOpenidStatus (data) {
	return request({
		url: `${attendance}/wechatOpenid/batchUpdateStatus`,
		method: "post",
		data,
	});
}
