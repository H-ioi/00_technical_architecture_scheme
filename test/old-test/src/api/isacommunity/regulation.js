import request from "@/router/newaxios/axios";
const path = "/isacommunity/clinic/regulation";

// 获取规章制度分页列表
export function getRegulationPage(params) {
  return request({
    url: `${path}/paginate`,
    method: "get",
    params: { ...params },
  });
}

// 获取规章制度详情
export function getRegulationDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: "get",
  });
}

// 新增规章制度
export function addRegulation(data) {
  return request({
    url: `${path}/add`,
    method: "post",
    data,
  });
}

// 更新规章制度
export function editRegulation(data) {
  return request({
    url: `${path}/edit`,
    method: "post",
    data,
  });
}

// 删除规章制度
export function delRegulation(ids) {
  return request({
    url: `${path}/del`,
    method: "delete",
    params: { ids },
  });
}
