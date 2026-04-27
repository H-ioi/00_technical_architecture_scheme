import request from "@/router/newaxios/axios";
import VuexStore from '@/store/index.js'
const path = "/isacommunity/membership"
// 获取班级下拉
export function getFormList () {
	return request({
		url: `${path}/getFormList`,
		method: "get",
	});
}
// 获取校区下拉
export function getSchoolList () {
	return request({
		url: `${path}/getSchoolList`,
		method: "get",
	});
}

// 获取教师职称
export function getTeacherRoleList () {
	return request({
		url: `${path}/getTeacherRoleList`,
		method: "get",
	});
}
// 获取年级
export function getYeargroupList () {
	return request({
		url: `${path}/getYeargroupList`,
		method: "get",
	});
}
// 获取学生分页
export function getStudentPage (data) {
	return request({
		url: `${path}/getStudentPage`,
		method: "get",
		params: data,
	});
}
// 获取教师分页
export function getTeacherPage (data) {
	return request({
		url: `${path}/getTeacherPage`,
		method: "get",
		params: data,
	});
}
// 获取教师详情
export function getTeacherDetail (id) {
	return request({
		url: `${path}/getTeacherDetail?teacherId=${id}`,
		method: "get",
	});
}
export function getSchool () {
	new Promise((resolve, reject) => {
		getSchoolList().then((res) => {
			if (res.data.success) {
				console.log('1111getSchool', res.data.data);

				VuexStore.commit('SET_DICTIONARY', { school: res.data.data })
				resolve(res.data.data);
			} else {
				resolve([]);
			}
		});
	})
}
export function getForm () {
	new Promise((resolve, reject) => {
		getFormList().then((res) => {
			if (res.data.success) {
				VuexStore.commit('SET_DICTIONARY', { form: res.data.data })
				resolve(res.data.data);
			} else {
				resolve([]);
			}
		});
	})
}
export function getTeacherRole () {
	new Promise((resolve, reject) => {
		getTeacherRoleList().then((res) => {
			if (res.data.success) {
				VuexStore.commit('SET_DICTIONARY', { teacherRole: res.data.data })
				resolve(res.data.data);
			} else {
				resolve([]);
			}
		});
	})
}
export function getYeargroup () {
	new Promise((resolve, reject) => {
		getYeargroupList().then((res) => {
			if (res.data.success) {
				VuexStore.commit('SET_DICTIONARY', { yeargroup: res.data.data })
				resolve(res.data.data);
			} else {
				resolve([]);
			}
		});
	})
}
