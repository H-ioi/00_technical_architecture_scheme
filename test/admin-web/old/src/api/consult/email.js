import request from '@/router/axios'
const email = "/enquiry/email"
const common = "/enquiry/common"
// 获取个人邮件信息--个人信息首页点击查看个人邮箱（需登录）

export async function getUserEmailBaseInfo () {
	try {
		const res = await request({
			url: `${email}/get/getUserEmailBaseInfo`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 获取外部邮箱
export async function getOuterEmail (data = {}) {
	try {
		const res = await request({
			url: `${email}/get/outerEmail`,
			method: "post",
			data
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 获取当前用户发送邮件账户
export async function getEmailCurrentUser () {
	try {
		const res = await request({
			url: `${email}/get/sendEmailAccountByCurrentUser`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 获取所有用户发送邮件账户
export async function getOrganizationUserEmail () {
	try {
		const res = await request({
			url: `${common}/getOrganizationUserEmail`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 获取发送邮件列表
export function getEmailList (data = {}) {
	return request({
		url: `${email}/get/emailRecordList`,
		method: 'post',
		data: {
			...data,
			isQueryAll: false
		}
	})
}

// 获取发送邮件详细
export function getEmailDetail (id) {
	return request({
		url: `${email}/get/emailRecordInfo`,
		method: 'post',
		data: {
			id: id
		}
	})
}
// 发送邮件
export function sendEmail (data = {}) {
	return request({
		url: `${email}/sendEmail`,
		method: 'post',
		data
	})
}



// 获取用户邮箱列表
export function getUserEmailList (data = {}) {
	return request({
		url: `${email}/get/userEmailList`,
		method: 'post',
		data
	})
}
// 获取用户邮箱信息
export function getUserEmailInfo (id) {
	return request({
		url: `${email}/get/userEmailInfo`,
		method: 'post',
		data: {
			id: id
		}
	})
}
// 添加用户邮箱
export function addUserEmail (data = {}) {
	return request({
		url: `${email}/add/userEmailInfo`,
		method: 'post',
		data
	})
}
// 删除用户邮箱
export function delUserEmail (data = {}) {
	return request({
		url: `${email}/delete/userEmailInfo`,
		method: 'post',
		data
	})
}
// 更新用户邮箱
export function updateEmail (data = {}) {
	return request({
		url: `${email}/update/userEmailInfo`,
		method: 'post',
		data
	})
}
