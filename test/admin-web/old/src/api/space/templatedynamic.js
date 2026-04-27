import request from '@/router/axios'
const path = "/publik"
/**
 * 新增动态表单模板
 */
export function addTemplate (data) {
	return request({
		url: `${path}/template/dynamic/form/add`,
		method: 'post',
		data
	})
}
/**
 * 新增POOL动态表单模板
 */
export function addCollection (data) {
	return request({
		url: `${path}/template/dynamic/form/addCollection`,
		method: 'post',
		data
	})
}
/**
 * 编辑动态表单模板
 */
export function editTemplate (data) {
	return request({
		url: `${path}/template/dynamic/form/edit`,
		method: 'post',
		data
	})
}
/**
 * 获取动态表单列表
 */
export function getTemplateList (data) {
	return request({
		url: `${path}/template/dynamic/form/paginate`,
		method: 'post',
		data: data,
	})
}
/**
 * 获取动态表单列表
 */
export function getDynamicTemplateList (data) {
	return request({
		url: `${path}/dynamic/form/template/paginate`,
		method: 'post',
		data: data,
	})
}
export function getIsaDynamicTemplateList (data) {
	return request({
		url: `${path}/dynamic/form/template/paginateIsaCommunityCollection`,
		method: 'post',
		data: data,
	})
}
/**
 * 获取动态表单详情
 */
export function getTemplateDetail (id) {
	return request({
		url: `${path}/template/dynamic/form/get/${id}`,
		method: 'get',
	})
}
/**
 * 删除
 */
export function delTemplate (id) {
	return request({
		url: `${path}/template/dynamic/form/del/${id}`,
		method: 'delete',
	})
}
/**
 * 新增表单
 */
export function addDynamic (data) {
	return request({
		url: `${path}/dynamic/form/add`,
		method: 'post',
		data
	})
}
/**
 * 编辑动态表单模板
 */
export function editDynamic (data) {
	return request({
		url: `${path}/dynamic/form/edit`,
		method: 'post',
		data
	})
}
/**
 * 查看动态表单模板
 */
export function getDynamicDetail (id) {
	return request({
		url: `${path}/dynamic/form/get/${id}`,
		method: 'get',

	})
}
/**
 * 批量查看动态表单模板
 */
export function getDynamicDetailList (data) {
	return request({
		url: `${path}/dynamic/form/batch/get`,
		method: 'get',
		params: {
			...data
		},
	})
}
export function getTemplateRegex (data) {
	return request({
		url: `${path}/template/regex/paginate`,
		method: 'get',
		params: {
			...data
		},
	})
}
/**
 * 更新动态表单模板
 */
export function bindTemplateOuterId (data) {
	return request({
		url: `${path}/template/dynamic/form/update/outerId`,
		method: 'post',
		data
	})
}
/**
 * 获取动态表单模板
 */
export function getTemplateOuterId (data) {
	return request({
		url: `${path}/template/dynamic/form/get/outerId`,
		method: 'get',
		params: {
			...data
		},
	})
}
/**
 * 获取动态表单模板
 */
export function getTemplateFormList (data) {
	return request({
		url: `${path}/template/dynamic/form/getTemplateFormListByOuterId`,
		method: 'get',
		params: {
			...data
		},
	})
}
/**
 * 启用禁用动态表单模板
 */
export function updateTemplateStatus (data) {
	return request({
		url: `${path}/template/dynamic/form/updateTemplateFormStatus`,
		method: 'post',
		data
	})
}
/**
 * 获取动态表单模板
 */
export function getValueOuterId (data) {
	return request({
		url: `${path}/dynamic/form/get/outerId`,
		method: 'get',
		params: {
			...data
		},
	})
}
/**
 * 获取动态表单模板
 */
export function isExistData (id) {
	return request({
		url: `${path}/template/dynamic/form/get/isExistData/${id}`,
		method: 'get',
	})
}
export function getTemplateHasList (id) {
	return new Promise((resolve, reject) => {
		isExistData(id).then(res => {
			if (res.data.success) {
				resolve(res.data.data)
			} else {
				resolve(false)
			}
		});

	});
}
/**
 * 获取动态表单模板
 */
export function getTemplateOuterForm (data) {
	return new Promise((resolve, reject) => {
		if (data['outerId']) {
			getTemplateFormList(data).then(res => {
				if (res.data.success) {
					if (res.data.data.length > 0) {
						let data = res.data.data.filter(item => {
							return !item['status']
						})
						let templateList = data.map((item) => {
							return item.id;
						});

						resolve(templateList);
					} else {
						resolve([]);
					}
				} else {
				}
			});
		} else {
			resolve([]);
		}

	});
}
/**
 * 获取动态表单模板
 */
export function getTemplateOuterValue (data) {
	return new Promise((resolve, reject) => {
		getValueOuterId(data).then(res => {
			if (res.data.success) {
				if (res.data.data.length > 0) {
					let obj = {};
					res.data.data.map((item) => {
						obj[item["templateFormId"]] = item["id"];
					});
					resolve(obj)
				} else {
					resolve({});
				}
			} else {
				resolve({});
			}
		});
	});
}