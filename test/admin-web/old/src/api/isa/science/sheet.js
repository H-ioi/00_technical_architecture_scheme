import request from '@/router/axios'
const path = '/isadatacenter/dataformmanager'
/**
 * 数据表格-分页
 */
export function getSheetList (data) {
	return request({
		url: `${path}/paginate`,
		method: 'get',
		params: data
	})
}
/**
 * 数据表格-查看
 */
export function lookSheet (id) {
	return request({
		url: `${path}/get/` + id,
		method: 'get',
	})
}
/**
 * 数据表格-新增
 */
export function addSheet (data) {
	return request({
		url: `${path}/add`,
		method: 'post',
		data: data
	})
}
/**
 * 数据表格-编辑
 */
export function editSheet (data) {
	return request({
		url: `${path}/edit`,
		method: 'post',
		data: data
	})
}
/**
 * 数据表格-删除
 */
export function delSheet (data) {
	return request({
		url: `${path}/del`,
		method: 'delete',
		data: data
	})
}
/**
 * 数据表格-模板列表
 */
export function getmodellist () {
	return request({
		url: `${path}/getmodellist`,
		method: 'get',
	})
}
/**
 * 数据表格-模板下载
 */
export function downloadModel (id) {
	return request({
		url: `${path}/file/download/${id}`,
		method: 'get',
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	})
}



