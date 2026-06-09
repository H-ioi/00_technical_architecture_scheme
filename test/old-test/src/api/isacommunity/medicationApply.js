import request from "@/router/newaxios/axios";
const path = "/isacommunity/clinic/medication-application";

// 获取用药申请分页列表
export function getMedicationApplyPage(params) {
  return request({
    url: `${path}/paginate`,
    method: "get",
    params: { ...params },
  });
}

// 获取用药申请详情
export function getMedicationApplyDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: "get",
  });
}

// 新增用药申请
export function addMedicationApply(data) {
  return request({
    url: `${path}/add`,
    method: "post",
    data,
  });
}

// 更新用药申请
export function editMedicationApply(data) {
  return request({
    url: `${path}/edit`,
    method: "post",
    data,
  });
}

// 删除用药申请
export function delMedicationApply(ids) {
  return request({
    url: `${path}/del`,
    method: "delete",
    params: { ids },
  });
}

// 导入用药申请
export function importMedicationApply(file) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: `${path}/import`,
    method: "post",
    data: formData,
    headers: {
      VERSION: "B",
    },
  });
}

// 导出用药申请
export function exportMedicationApply(params) {
  return request({
    url: `${path}/export`,
    method: "get",
    params: { ...params },
    responseType: "blob",
  });
}
