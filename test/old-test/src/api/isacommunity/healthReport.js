import request from "@/router/newaxios/axios";
const path = "/isacommunity/clinic/health/exam/report";

// 获取体检报告分页列表
export function getHealthReportPage(params) {
  return request({
    url: `${path}/paginate`,
    method: "get",
    params: { ...params },
  });
}

// 获取体检报告详情
export function getHealthReportDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: "get",
  });
}

// 新增体检报告
export function addHealthReport(data) {
  return request({
    url: `${path}/add`,
    method: "post",
    data,
  });
}

// 更新体检报告
export function editHealthReport(data) {
  return request({
    url: `${path}/edit`,
    method: "post",
    data,
  });
}

// 删除体检报告
export function delHealthReport(ids) {
  return request({
    url: `${path}/del`,
    method: "delete",
    params: { ids },
  });
}

// 导入体检报告
export function importHealthReport(file) {
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

// 导出体检报告
export function exportHealthReport(params) {
  return request({
    url: `${path}/export`,
    method: "get",
    params: { ...params },
    responseType: "blob",
  });
}
