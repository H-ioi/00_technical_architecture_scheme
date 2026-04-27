import request from "@/router/newaxios/axios";
const baseUrl = "/isacommunity";


export function getSchoolList() {
	return request({
		url: `${baseUrl}/attendance/common/getOldSchoolList`,
		method: 'get',
	})
}
export function getBoardingHouseList(params) {
	return request({
		url: `${baseUrl}/attendance/common/getBoardingHouseList`,
		method: 'post',
		data: params,
	})
}

export function getDivisionNameList(params) {
	return request({
		url: `${baseUrl}/attendance/common/getDivisionNameList`,
		method: 'post',
		data: params,
	})
}

export async function listMailGroup(params) {
	try {
		const res = await request({
			url: `${baseUrl}/mailing/group/page`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}




export async function getAllUserEmailForTenant5() {
	return request({
		url: `${baseUrl}/mailing/userMailinfo/getAllUserEmailForTenant5`,
		method: "get",
	})
}
export function exportSendRecord(id) {
  return request({
    url: `${baseUrl}/mailing/sendRecord/exportRecipientStatus?id=${id}`,
	method: 'get',
	header: {
	  headers: {
		"Content-Type": "application/x-download"
	  }
	},
	responseType: "blob"
  })
}


export async function listSendRecord(params) {
	try {
		const res = await request({
			url: `${baseUrl}/mailing/sendRecord/page`,
			method: "get",
			params,
			headers: {
				'TENANT-ID': 5
			}
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


export async function listUserMailinfo(params) {
	try {
		const res = await request({
			url: `${baseUrl}/mailing/userMailinfo/page`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}






export function getStudentList(data) {
	return request({
		url: `${baseUrl}/attendance/common/getStudentList`,
		method: "post",
		data,
	});
}


export function saveMailRecord(data) {
	return request({
		url: `${baseUrl}/mailing/sendRecord/create`,
		method: "post",
		data,
		headers: {
			'TENANT-ID': 5
		}
	});
}

export function updateMailRecord(data) {
	return request({
		url: `${baseUrl}/mailing/sendRecord/update`,
		method: "post",
		data,
	});
}



export function removeSendRecord(data) {
	return request({
		url: `${baseUrl}/mailing/sendRecord/remove`,
		method: "post",
		params: data,
		
	});
}

//删除发送邮箱列表里的用户
export function removeUserMailinfo(data) {
	return request({
		url: `${baseUrl}/mailing/userMailinfo/remove`,
		method: "post",
		params: data,
		headers: {
			'TENANT-ID': 5
		}
	});
}


export function batchUpdateUserMailinfoStatus(data) {
	return request({
		url: `${baseUrl}/mailing/userMailinfo/batchUpdateStatus`,
		method: "post",
		params: data,
		headers: {
			'TENANT-ID': 5
		}
	});
}





export async function getSendRecordDetail(params) {
	try {
		const res = await request({
			url: `${baseUrl}/mailing/sendRecord/detail`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}

//发送邮箱列表里的详情
export async function getUserMailinfoDetail(params) {
	try {
		const res = await request({
			url: `${baseUrl}/mailing/userMailinfo/detail`,
			method: "get",
			params,
		});
		return res.data.data;
	} catch (error) {
		throw error;
	}
}


export function addMailRelations(obj) {
  return request({
    url: `${baseUrl}/mailing/userMailinfo/saveOrUpdateWithRelations`,
    method: 'post',
    params: obj,
    headers: {
      'TENANT-ID': 5
    }
  })
}


export function deleteMailGroup(data) {
	return request({
		url: `${baseUrl}/mailing/group/delete`,
		method: "post",
		params: data,
	});
}
export function batchUpdateMailGroupStatus(data) {
	return request({
		url: `${baseUrl}/mailing/group/batchUpdateStatus`,
		method: "post",
		params: data,
	});
}




export function createMailGroup(data) {
	return request({
		url: `${baseUrl}/mailing/group/create`,
		method: "post",
		data,
		headers: {
			'TENANT-ID': 5
		}
	});
}	
export function updateMailGroup(data) {
	return request({
		url: `${baseUrl}/mailing/group/update`,
		method: "post",
		data,
		headers: {
			'TENANT-ID': 5
		}
	});
}	

export function getGradeList() {
	return request({
		url: `${baseUrl}/attendance/common/getGradeList`,
		method: "get",
	
	});
}


export function uploadFile(obj) {

  return request({
    url: `${baseUrl}/mailing/sendRecord/upload`,
    method: 'post',
    data: obj,
    headers: {
      'TENANT-ID': 5
    }
  })
}

