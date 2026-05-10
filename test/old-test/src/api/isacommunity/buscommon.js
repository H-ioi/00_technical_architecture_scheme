import request from "@/router/newaxios/axios";
const path = "/isacommunity/buscommon";
export async function getDriverList (params, status = 1) {
	try {
		const res = await request({
			url: `${path}/getDriverList`,
			method: "get",
			params
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
export async function getCarinfoList (params) {
	try {
		const res = await request({
			url: `${path}/getCarinfoList`,
			method: "get",
			params
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

export async function getLineList (params) {
	try {
		const res = await request({
			url: `${path}/getLineList`,
			method: "get",
			params
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
export async function getPickupMethodList () {
	try {
		const res = await request({
			url: `${path}/getPickupMethodList`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
export async function getSchoolList () {
	try {
		const res = await request({
			url: `${path}/getSchoolList`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
export async function getSectionList (params) {
	try {
		const res = await request({
			url: `${path}/getSectionList`,
			method: "get",
			params
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
export async function getStationList (params) {
	try {
		const res = await request({
			url: `${path}/getStationList`,
			method: "get",
			params
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
export async function getOrderStationList (params) {
	try {
		const res = await request({
			url: `${path}/getOrderStationList`,
			method: "get",
			params
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 获取跟车老师
export async function getTeacherList (params) {
	try {
		const res = await request({
			url: `${path}/getTeacherList`,
			method: "get",
			params
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
