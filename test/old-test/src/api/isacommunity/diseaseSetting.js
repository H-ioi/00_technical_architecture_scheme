import request from "@/router/newaxios/axios";
const path = "/isacommunity/clinic/disease-setting";

// 获取疾病设置分页列表
export function getDiseaseSettingPage(params) {
  return request({
    url: `${path}/paginate`,
    method: "get",
    params: { ...params },
  });
}

// 获取疾病设置详情
export function getDiseaseSettingDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: "get",
  });
}

// 新增疾病设置
export function addDiseaseSetting(data) {
  return request({
    url: `${path}/add`,
    method: "post",
    data,
  });
}

// 更新疾病设置
export function editDiseaseSetting(data) {
  return request({
    url: `${path}/edit`,
    method: "post",
    data,
  });
}

// 删除疾病设置
export function delDiseaseSetting(ids) {
  return request({
    url: `${path}/del`,
    method: "delete",
    params: { ids },
  });
}
