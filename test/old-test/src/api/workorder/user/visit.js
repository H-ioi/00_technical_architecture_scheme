import request from "@/router/axios";
const path = "/workorder/visit/info";
/**
 * 获取列表
 */
export function getVisitList(data) {
  return request({
    url: `${path}/paginate`,
    method: "post",
    data: data,
  });
}
/**
 * 新增
 */
export function addVisit(data) {
  return request({
    url: `${path}/add`,
    method: "post",
    data: data,
  });
}
/**
 * 编辑
 */
export function editVisit(data) {
  return request({
    url: `${path}/edit`,
    method: "post",
    data: data,
  });
}
/**
 * 删除
 */
export function delVisit(id) {
  return request({
    url: `${path}/del/${id}`,
    method: "delete",
  });
}
/**
 * 审批
 */
export function approveVisit(data) {
  return request({
    url: `${path}/audit/one/${data.id}`,
    method: "put",
    params: {
      status: data.status,
    },
  });
}
/**
 * 批量审批
 */
export function batchApproveVisits(params = {}, data = {}) {
  return request({
    url: `${path}/audit/batch`,
    method: "put",
    params: params,
    data: data,
  });
}
/**
 * 时间配置
 */
export function configTimerange(data) {
  return request({
    url: `${path}/config/timerange`,
    method: "post",
    data: data,
  });
}
/**
 * 详情
 */
export function getVisitDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: "get",
  });
}
/**
 * 获取参数信息
 */
export async function getParamInfo() {
  try {
    const res = await request({
      url: `${path}/param/info`,
      method: "get",
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
}
// 文件上传
export async function uploadFile(data) {
  try {
    const res = await request({
      url: `${path}/photo/upload`,
      method: "post",
      data: data,
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
}
