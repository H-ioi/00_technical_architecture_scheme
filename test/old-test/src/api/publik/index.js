/*
 * @Author: aimagou 1129533009@qq.com
 * @Date: 2023-08-08 10:21:51
 * @LastEditors: aimagou 1129533009@qq.com
 * @LastEditTime: 2023-11-01 18:03:58
 * @FilePath: \PC_order\src\api\publik\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/router/axios'
export function addType (obj) {
	return request({
		url: '/publik/dict/item/add',
		method: 'post',
		data: obj
	})
}
export function putDisable (id) {
	return request({
		url: `/publik/dict/item/disable/${id}`,
		method: 'put',
	})
}
export function putEnable (id) {
	return request({
		url: `/publik/dict/item/enable/${id}`,
		method: 'put',
	})
}
export function putEdit (obj) {
	return request({
		url: `/publik/dict/item/edit`,
		method: 'put',
		data: obj
	})
}
export function fetchTypeList (type) {
	return request({
		url: `/publik/dict/item/get/${type}`,
		method: 'get',
	})
}
export function delType (id) {
	return request({
		url: '/publik/dict/item/del/' + id,
		method: 'delete'
	})
}
export function getPublikTypeList (data) {
	return request({
		url: `/publik/dict/item/get/child/types`,
		method: 'get',
		params: { ...data },
	})
}
export function getDictTypeList (pid, data = {}) {
	return request({
		url: `/publik/dict/item/get/child2/${pid}`,
		method: 'get',
		params: { ...data },
	})
}
export function getRelationDictList (pid, data = {}) {
	return request({
		url: `/publik/dict/item/relation/get/${pid}`,
		method: 'get',
		params: { ...data },
	})
}
export function getRelationDictChild (pid) {
	return request({
		url: `/publik/dict/item/relation/child/${pid}`,
		method: 'get',
	})
}
export function putRelationDict (data) {
	return request({
		url: `/publik/dict/item/relation/setting`,
		method: 'put',
		data
	})
}
export function enableRelationDict (data) {
	return request({
		url: `/publik/dict/item/relation/enable`,
		method: 'put',
		params: data,
	})
}
export function disableRelationDict (data) {
	return request({
		url: `/publik/dict/item/relation/disable`,
		method: 'put',
		params: data,
	})
}
export function editRelationDict (data) {
	return request({
		url: `/publik/dict/item/relation/edit`,
		method: 'put',
		data: data
	})
}
export function getDictTypeField (data) {
	return request({
		url: `/publik/dict/item/type/get/field`,
		method: 'get',
		params: data,
	})
}
export function getDictTypeTree (id) {
	return request({
		url: `/publik/dict/item/relation/tree/` + id,
		method: 'get',
	})
}
export function getDictFieldAllList (data) {
	return request({
		url: `/publik/dict/item/get/field2`,
		method: 'get',
		params: data,
	})
}
// 批量获取字典附加属性值
export const getDictTypesAllList = async (data) => {
	return new Promise(resolve => {
		getDictFieldAllList(data).then((res) => {
			let obj = {}
			obj[data['dictType']] = res.data.data
			resolve(obj)
		})

	})
}
export function getDictTypeRequired (pid) {
	return new Promise(resolve => {
		const types = {
			enquiry_channel: 'channel',
			enquiry_direction: 'direction',
			enquiry_enroll_level: 'enrollLevel',
			enquiry_follow_tags: 'followTags',
			enquiry_pay_subject: 'paySubject',
		}
		let data = {
			pid: pid,
			fieldTypes: ["required"],
			types: ["enquiry_channel", "enquiry_direction", "enquiry_enroll_level", "enquiry_follow_tags", "enquiry_pay_subject"]
		};
		let obj = {}
		getDictTypeField(data).then(res => {
			console.log("getDictTypeField", res);
			if (res.data.success) {
				let data = res.data.data;
				data.map(item => {
					obj[types[item.dictType]] = item.value;
				});
				resolve(obj)
			}
		});
	})
}