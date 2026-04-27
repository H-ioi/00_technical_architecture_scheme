import request from '@/router/axios'
const path = "/workspace"
/**
 * 获取顶级目录
 */
export function getSpaceTop() {
  return request({
    url: `${path}/space/top`,
    method: 'get',
  })
}
/**
 * 获取空间类型列表
 */
export function getSpaceTypeList(data, spaceId) {
  return request({
    url: `${path}/space/type/page/${spaceId}`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 获取所有空间类型列表
 */
export function getAllSpaceType(spaceId) {
  return request({
    url: `${path}/space/type/list/${spaceId}`,
    method: 'get',
  })
}
/**
 * 新增空间类型
 */
export function addSpaceType(data) {
  return request({
    url: `${path}/space/type/save`,
    method: 'post',
    data
  })
}
/**
 * 编辑空间类型
 */
export function editSpaceType(data) {
  return request({
    url: `${path}/space/type/update`,
    method: 'put',
    data
  })
}
/**
 * 禁用
 */
export function disableSpaceType(id) {
  return request({
    url: `${path}/space/type/disable/${id}`,
    method: 'post',
  })
}
/**
 * 启用
 */
export function enableSpaceType(id) {
  return request({
    url: `${path}/space/type/enable/${id}`,
    method: 'post',
  })
}
/**
 * 查看详情
 */
export function getSpaceTypeDetail(id) {
  return request({
    url: `${path}/space/type/get/${id}`,
    method: 'get',
  })
}
/**
 * 绑定空间
 */
export function bindSpaceType(data) {
  return request({
    url: `${path}/space/type/binging`,
    method: 'post',
    data
  })
}
/**
 * 统计
 */
export function getSpaceStatistics(data) {
  return request({
    url: `${path}/chart/asset/statistics`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 利用率
 */
export function getSpaceBriefing(data) {
  return request({
    url: `${path}/chart/briefing`,
    method: 'get',
    params: {
      ...data
    },
  })
}
