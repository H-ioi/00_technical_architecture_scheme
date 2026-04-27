import request from "@/router/newaxios/axios";
const baseUrl = "/attendance";
// 获取校区
export async function getConfigList2(params) {
	try {
		const res = await request({
			url: `${baseUrl}/sys/config/list`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
export function saveConfig(data) {
	
	return request({
		url: `${baseUrl}/sys/config/save`,
		method: "post",
		data,
	});
}







export function updateConfig(data) {
	return request({
		url: `${baseUrl}/sys/config/update`,
		method: "post",
		data,
	});
}



export async function deleteConfig(id) {
	try {
		const res = await request({
			url: `${baseUrl}/sys/config/${id}`,
			method: "delete",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


