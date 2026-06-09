import request from "@/router/newaxios/axios";
const baseUrl = "/isacommunity";
// 获取校区

// 获取学生分页
export async function getDormStudentListPage(params) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/student/page`,
			method: "get",
			params
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

export async function getDormStudentHistoryListPage(params) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/student/history/page`,
			method: "get",
			params
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


export async function getDormBedAssignRuleListPage(params) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/bed/assign-rule/page`,
			method: "get",
			params
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


export async function getBuildingList(params) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/building/list`,
			method: "get",
			params
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

export async function getRoomList(params) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/room/list`,
			method: "get",
			params
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

export async function getBedList(params) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/bed/list`,
			method: "get",
			params
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}



export async function saveBed(data) {
	return request({
		url: `${baseUrl}/dormitory/bed/create`,
		method: "post",
		data,
	});
}

export async function deleteBed(data) {
	return request({
		url: `${baseUrl}/dormitory/bed/delete`,
		method: "post",
		params:data,
	});
}


export async function getFloorList(params) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/floor/list`,
			method: "get",
			params
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

export async function getBuildingListPage(params) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/building/page`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
export async function getStudentDetail(params) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/student/detail`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


export async function getStudentHistoryDetail(params) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/student/history/detail`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


export async function editStudent(data) {
	return request({
		url: `${baseUrl}/dormitory/student/edit`,
		method: "post",
		params:data,
	});
}
export async function editStudentHistory(data) {
	return request({
		url: `${baseUrl}/dormitory/student/history/editCheckoutDate`,
		method: "post",
		params:data,
	});
}



export async function getProjectList(params) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/project/list`,
			method: "get",
			params
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}




export async function getFloorListPage(params) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/floor/page`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

export async function getStudentInfo(params) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/student/student-service/student-info`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}



// 获取床位分页
export async function getBedListPage(id) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/room/${id}`,
			method: "get",
			
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}




// 删除楼层
export async function deleteFloorBatch(data) {
	return request({
		url: `${baseUrl}/dormitory/floor/delete`,
		method: "post",
		params: data,
	});
}

export async function deleteBedBatch(data) {
	return request({
		url: `${baseUrl}/dormitory/bed/deleteBatch`,
		method: "post",
		params: data,
	});
}

export async function deleteBedAssignRuleBatch(data) {
	return request({
		url: `${baseUrl}/dormitory/bed/assign-rule/deleteBatch`,
		method: "post",
		params: data,
	});
}




export async function saveRoom(data) {
	return request({
		url: `${baseUrl}/dormitory/room/create`,
		method: "post",
		data,
	});
}

export async function updateRoom(data) {
	return request({
		url: `${baseUrl}/dormitory/room/update`,
		method: "post",
		data,
	});
}

export async function saveBedAssignRule(data) {
	return request({
		url: `${baseUrl}/dormitory/bed/assign-rule/create`,
		method: "post",
		data,
	});
}
export async function autoAssignBed(data) {
	return request({
		url: `${baseUrl}/dormitory/bed/assignment/autoAssign`,
		method: "post",
		data,
	});
}

/**计划退宿 */
export async function plannedCheckout(data) {
	return request({
		url: `${baseUrl}/dormitory/student/planned-checkout`,
		method: "post",
		params: data,
	});
}


export async function checkoutBedBatch(data) {
	return request({
		url: `${baseUrl}/dormitory/bed/assignment/checkoutBatch`,
		method: "post",
		params: data,
	});
}




export async function updateBedAssignRule(data) {
	return request({
		url: `${baseUrl}/dormitory/bed/assign-rule/update`,
		method: "post",
		data,
	});
}



// 获取房间详情
export async function getRoomDetail(id) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/room/${id}`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

export async function moveBed(data) {
	return request({
		url: `${baseUrl}/dormitory/bed/assignment/move`,
		method: "post",
		data,
	});
}



// 新增楼层
export async function saveFloor(data) {
	return request({
		url: `${baseUrl}/dormitory/floor/create`,
		method: "post",
		data,
	});
}
// 获取楼层详情
export async function getFloorDetail(id) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/floor/${id}`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

// 更新楼层
export async function updateFloor(data) {
	return request({
		url: `${baseUrl}/dormitory/floor/update`,
		method: "post",
		data,
	});
}
// 办理入住
export async function assignBed(data) {
	return request({
		url: `${baseUrl}/dormitory/bed/assignment/assign`,
		method: "post",
		data,
	});
}


export async function deleteRoomBatch(data) {
	return request({
		url: `${baseUrl}/dormitory/room/delete`,
		method: "post",
		params: data,
	});
}

export async function manualAddStudent(data) {
	return request({
		url: `${baseUrl}/dormitory/student/student-service/manual-add`,
		method: "post",
		params: data,
	});
}




// 退房
export async function checkoutBed(data) {
	return request({
		url: `${baseUrl}/dormitory/bed/assignment/checkout`,
		method: "post",
		data,
	});
}


// 获取项目详情
export async function getProjectDetail(id) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/project/${id}`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

export async function getProjectListPage(params) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/project/page`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


export async function getRoomListPage() {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/room/page`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


export function saveAttribute(data) {
	return request({
		url: `${baseUrl}/dormitory/project/create`,
		method: "post",
		data,
	});
}

// 新增楼宇
export function saveBuilding(data) {
	return request({
		url: `${baseUrl}/dormitory/building/create`,
		method: "post",
		data,
	});
}
export function activateBuilding(data) {
	return request({
		url: `${baseUrl}/dormitory/building/activate`,
		method: "post",
		params: data,
	});
}
export function deactivateBuilding(data) {
	return request({
		url: `${baseUrl}/dormitory/building/deactivate`,
		method: "post",
		params: data,	
	});
}
export function deactivateFloor(data) {
	return request({
		url: `${baseUrl}/dormitory/floor/deactivate`,
		method: "post",
		params: data,	
	});
}


export function activateFloor(data) {
	return request({
		url: `${baseUrl}/dormitory/floor/activate`,
		method: "post",
		params: data,	
	});
}


export function activateRoom(data) {
	return request({
		url: `${baseUrl}/dormitory/room/activate`,
		method: "post",
		params: data,	
	});
}


export function deactivateRoom(data) {
	return request({
		url: `${baseUrl}/dormitory/room/deactivate`,
		method: "post",
		params: data,	
	});
}






// 更新楼宇
export function updateBuilding(data) {
	return request({
		url: `${baseUrl}/dormitory/building/update`,
		method: "post",
		data,
	});
}
// 删除楼宇
export function getBuildingDetail(id) {
	return request({
		url: `${baseUrl}/dormitory/building/${id}`,
		method: "get",
	});
}

// 删除楼宇
export function deleteBuildingBatch(data) {
	return request({
		url: `${baseUrl}/dormitory/building/delete`,
		method: "post",
		params: data,
	});
}
export function deleteProjectBatch(data) {
	return request({
		url: `${baseUrl}/dormitory/project/deleteBatch`,
		method: "post",
		params: data,
	});
}















//==========================



export async function getFlowModelef(id) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/flwdemodel/${id}`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


/**
 * 爱莎数据平台学术看板管理-模糊查询学生
 */
export function searchStudentList(data) {
	
  return request({
	url: `/isacommunity/membership/searchList`,
	method: 'get',
	params: data
  })
}

export async function getOldSchoolList() {
	try {
		const res = await request({
			url: `/isacommunity/attendance/common/getOldSchoolList`,
			method: 'get'
		});
		return res.data ? res.data.data : res.data;
	} catch (error) {
		throw error;
	}
}


export function saveHolidayEnd(data) {
	return request({
		url: `${baseUrl}/holiday-return/save-holiday-return`,
		method: "post",
		data,
	});
}
export function cancelHoliday(data) {
	return request({
		url: `${baseUrl}/holiday/cancel`,
		method: "post",
		data,
	});
}

export function saveReleasePass(data) {
	return request({
		url: `${baseUrl}/leave/pass/save`,
		method: "post",
		data,
	});
}

export function updateReleasePass(data) {
	return request({
		url: `${baseUrl}/leave/pass/update`,
		method: "post",
		data,
	});
}

export function updateHoliday(data) {
	return request({
		url: `${baseUrl}/holiday/update`,
		method: "post",
		data,
	});
}

export async function listFlowDef(params) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/flwdemodel/list`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
export async function listRuleItemList(params) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/bed/assign-rule/ruleItemList`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}




export async function getAssignRuleInfo(id) {
	try {
		const res = await request({
			url: `${baseUrl}/dormitory/bed/assign-rule/${id}`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}





