import request from "@/router/newaxios/axios";
const path = "/isacommunity/clinic/infectious";

// 获取传染病分页列表
export function getInfectiousDiseasePage(params) {
  return request({
    url: `${path}/paginate`,
    method: "get",
    params: { ...params },
  });
}

// 获取传染病详情
export function getInfectiousDiseaseDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: "get",
  });
}

// 新增传染病
export function addInfectiousDisease(data) {
  return request({
    url: `${path}/add`,
    method: "post",
    data,
  });
}

// 更新传染病
export function editInfectiousDisease(data) {
  return request({
    url: `${path}/edit`,
    method: "post",
    data,
  });
}

// 删除传染病
export function delInfectiousDisease(ids) {
  return request({
    url: `${path}/del`,
    method: "delete",
    params: { ids },
  });
}

// 导入传染病
export function importInfectiousDisease(file) {
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

// 导出传染病
export function exportInfectiousDisease(params) {
  return request({
    url: `${path}/export`,
    method: "get",
    params: { ...params },
    responseType: "blob",
  });
}
