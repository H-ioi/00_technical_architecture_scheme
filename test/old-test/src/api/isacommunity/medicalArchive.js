import request from "@/router/newaxios/axios";
const path = "/isacommunity/clinic/medicalarchive";

/** 获取学生医疗信息档案分页列表 */
export function getMedicalArchivePage(params) {
  return request({
    url: `${path}/paginate`,
    method: "get",
    params: { ...params },
  });
}

/** 获取学生医疗信息档案详情 */
export function getMedicalArchiveDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: "get",
  });
}

/** 更新学生医疗信息档案 */
export function editMedicalArchive(data) {
  return request({
    url: `${path}/edit`,
    method: "post",
    data,
  });
}

/** 批量注销学生医疗信息档案 */
export function batchCancelMedicalArchive(ids) {
  return request({
    url: `${path}/del`,
    method: "delete",
    params: { ids },
  });
}
