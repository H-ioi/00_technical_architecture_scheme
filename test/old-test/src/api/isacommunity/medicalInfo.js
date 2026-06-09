import request from "@/router/newaxios/axios";
const path = "/isacommunity/clinic/medicalinfo";

/** 获取学生医疗信息分页列表 */
export function getMedicalInfoPage(params) {
  return request({
    url: `${path}/paginate`,
    method: "get",
    params: { ...params },
  });
}

/** 获取学生医疗信息详情 */
export function getMedicalInfoDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: "get",
  });
}

/** 新增学生医疗信息 */
export function addMedicalInfo(data) {
  return request({
    url: `${path}/add`,
    method: "post",
    data,
  });
}

/** 更新学生医疗信息 */
export function editMedicalInfo(data) {
  return request({
    url: `${path}/edit`,
    method: "post",
    data,
  });
}

/** 删除学生医疗信息 */
export function delMedicalInfo(ids) {
  return request({
    url: `${path}/del`,
    method: "delete",
    params: { ids },
  });
}

/** 导入学生医疗信息 */
export function importMedicalInfo(file) {
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

/** 导出学生医疗信息 */
export function exportMedicalInfo(params) {
  return request({
    url: `${path}/export`,
    method: "get",
    params: { ...params },
    responseType: "blob",
  });
}
