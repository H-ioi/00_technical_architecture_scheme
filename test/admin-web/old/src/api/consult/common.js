import request from '@/router/axios'
const path = "/enquiry/common"
const team = "/enquiry/team"
// 获取列表查询条件列表
export async function getRequestParamList (data = {}) {
	try {
		const res = await request({
			url: `/enquiry/common/get/requestParamList`,
			method: 'post',
			data: data
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 获取列表查询条件列表
export async function getRequestParamInfo (data = {}) {
	try {
		const res = await request({
			url: `/enquiry/common/get/requestParamInfo`,
			method: 'post',
			data: data
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 新增获取列表查询条件
export async function addRequestParam (data = {}) {
	try {
		const res = await request({
			url: `/enquiry/common/add/requestParam`,
			method: 'post',
			data: data
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 编辑获取列表查询条件
export async function editRequestParam (data = {}) {
	try {
		const res = await request({
			url: `/enquiry/common/update/requestParam`,
			method: 'post',
			data: data
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 删除列表查询条件列表
export async function delRequestParam (data = {}) {
	try {
		const res = await request({
			url: `/enquiry/common/del/requestParam`,
			method: 'post',
			data: data
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 获取组织架构人员信息
export async function getOrganizationUserInfo () {
	try {
		const res = await request({
			url: `${path}/getOrganizationUserInfo`,
			method: 'post',
			data: {}

		})
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
export async function getDptUserList () {
	let data = {};
	data["subDepartments"] = await getOrganizationUserInfo();
	// 使用示例
	let treeData = convertToTree(data);
	return treeData;
}
export function convertToTree (data) {
	// 处理部门节点
	let subDepartments = data.subDepartments || [];
	let departmentNodes =
		subDepartments.map((dept) => ({
			id: dept.departmentId, // 添加前缀避免与人员ID冲突
			label: dept.departmentName,
			type: 1, // 1表示部门
			children: convertToTree(dept), // 递归处理子部门
		})) || [];

	// 处理人员节点
	let userInfoList = data.userInfoList || [];
	let userNodes =
		userInfoList.map((user) => ({
			id: user.userId,
			label: user.userName, // 可根据实际字段调整
			type: 2, // 2表示人员
			is_leaf: true,
			...user, // 保留原始用户信息
		})) || [];

	// 合并部门和人员节点
	return [...departmentNodes, ...userNodes];
}
// 获取组织架构
export async function getOrganizationInfo () {
	try {
		const res = await request({
			url: `${path}/getOrganizationInfo`,
			method: 'post',
			data: {}

		})
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
// 获取团队列表
export async function getTeamIds () {
	try {
		const res = await request({
			url: `${team}/getTeamIds`,
			method: 'post',
			data: {}

		})
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
