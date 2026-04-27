import request from '@/router/axios'
const path = "/enquiry/template"
// 全部分页
export function getTemplateList (data = {}) {
	return request({
		url: `${path}/page`,
		method: 'post',
		data
	})
}
// 新增
export function addTemplate (data = {}) {
	return request({
		url: `${path}/add`,
		method: 'post',
		data
	})
}
// 编辑
export function editTemplate (data = {}) {
	return request({
		url: `${path}/edit`,
		method: 'post',
		data
	})
}
// 删除
export function delTemplate (data = {}) {
	return request({
		url: `${path}/del`,
		method: 'post',
		data
	})
}
// 获取详情
export function getTemplateInfo (data = {}) {
	return request({
		url: `${path}/get`,
		method: 'post',
		data
	})
}
// 更新状态
export function updateTemplateStatus (data = {}) {
	return request({
		url: `${path}/updateStatus`,
		method: 'post',
		data
	})
}
// 获取模板是否有数据
export async function getTemplateHasList (id) {
	try {
		const res = await request({
			url: `${path}/get/isExistData/${id}`,
			method: 'get',
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 新增表单数据
export function addTemplateData (data = {}) {
	return request({
		url: `${path}/dynamicSubmit`,
		method: 'post',
		data
	})
}
// 编辑表单数据
export function editTemplateData (data = {}) {
	return request({
		url: `${path}/dynamicEdit`,
		method: 'post',
		data
	})
}
// 获取模板信息
export async function getTemplateInfoByType (data = {}) {
	try {
		const res = await request({
			url: `${path}/get/TemplateInfoByType`,
			method: 'post',
			data
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 获取模板绑定字段
export async function getMappingFieldInfo (type = 0) {
	try {
		const res = await request({
			url: `${path}/getMappingFieldInfo`,
			method: 'post',
			data: { type: type }
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
