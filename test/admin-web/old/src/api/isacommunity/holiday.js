import request from "@/router/newaxios/axios";
const baseUrl = "/attendance";
// 获取校区
export async function getHolidayList() {
	try {
		const res = await request({
			url: `${baseUrl}/holiday/test`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
export function postFlowDef(data) {
	data.modeXml = JSON.stringify(data.modeXml);
	return request({
		url: `${baseUrl}/flow/flwdemodel/save`,
		method: "post",
		data,
	});
}
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
export function getStudentInfo(data) {
  return request({
	url: `/isacommunity/membership/getStudentInfo`,
	method: 'get',
	params: data
  })
}



export function saveHoliday(data) {
	return request({
		url: `${baseUrl}/holiday/save`,
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
export async function listHoliday(params) {
	try {
		const res = await request({
			url: `${baseUrl}/holiday/page`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}
export async function startFlowInstance(params) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/instance/startFlowInstance`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

export async function getFlowDef(id) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/deploy/flowDef/${id}`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


export async function setCustomVar(data) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/instance/variable`,
			method: "post",
			data,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}





export async function completeTask(params) {
	try {

		const res = await request({
			url: `${baseUrl}/flow/instance/completeFlow`,
			method: "post",
			data: params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

export async function rejectTask(params) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/instance/rejectFlow`,
			method: "post",
			data: params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}






export async function deleteFlowDef(id) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/flwdemodel/delete/${id}`,
			method: "delete",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


export async function deleteHoliday(id) {
	try {
		const res = await request({
			url: `${baseUrl}/holiday/${id}`,
			method: "delete",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}



export async function searchStudentByWord(params) {
	try {
		const res = await request({
			url: '/student/bordacademicdata/searchList',
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


export async function cancelFlow(id) {
	try {
		const res = await request({
			url: `${baseUrl}/holiday/back/${id}`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}



export async function deployDef(id) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/flwdemodel/deployFlow/${id}`,
			method: "get",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


export async function deleteDeployDef(id) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/flwdemodel/deployFlow/${id}`,
			method: "delete",
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}



export async function myTask(params) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/instance/myTodoTaskList`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

export async function myStartTask(params) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/instance/myStartTaskList`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

export async function myCompleteTask(params) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/instance/myCompleteTaskList`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


export async function getFormByBussId(params) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/instance/getFormByBussId`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


export async function getHiTaskInstance(processInstanceId) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/instance/getHiTaskInstance/${processInstanceId}`,
			method: "get",
		
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}




export async function getFlowDef2(params) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/deploy/flowDef2`,
			method: "post",
			data: params,	
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}







export async function listProcDef(params) {
	try {
		const res = await request({
			url: `${baseUrl}/flow/deploy/listProcDef`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


export function showProcessImg(defId) {
	return request({
		url: '/attendance/file/fileController/downloadFlowImg',
		method: 'get',
		params: { defId },
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	})
}

export function showProcessImgActive(procId) {
	return request({
		url: '/attendance/file/fileController/downloadFlowActiveImg',
		method: 'get',
		params: { procId },
		header: {
			headers: {
				"Content-Type": "application/x-download"
			}
		},
		responseType: "blob"
	})
}

export function getSchoolList() {
	return request({
		url: `/student/student/getAllSchool`,
		method: 'get',
	})
}