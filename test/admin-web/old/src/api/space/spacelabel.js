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
export function getSpaceLabelList(data, spaceId) {
  return request({
    url: `${path}/space/label/page/${spaceId}`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 获取所有空间类型列表
 */
export function getAllSpaceLabel(spaceId) {
  return request({
    url: `${path}/space/label/list/${spaceId}`,
    method: 'get',
  })
}
/**
 * 新增空间标签
 */
export function addSpaceLabel(data) {
  return request({
    url: `${path}/space/label/save`,
    method: 'post',
    data
  })
}
/**
 * 编辑空间类型
 */
export function editSpaceLabel(data) {
  return request({
    url: `${path}/space/label/update`,
    method: 'put',
    data
  })
}
/**
 * 禁用
 */
export function disableSpaceLabel(id) {
  return request({
    url: `${path}/space/label/disable/${id}`,
    method: 'post',
  })
}
/**
 * 启用
 */
export function enableSpaceLabel(id) {
  return request({
    url: `${path}/space/label/enable/${id}`,
    method: 'post',
  })
}
/**
 * 查看详情
 */
export function getSpaceLabelDetail(id) {
  return request({
    url: `${path}/space/label/get/${id}`,
    method: 'get',
  })
}
/**
 * 绑定空间
 */
 export function bindSpaceLabel(id,data) {
  return request({
    url: `${path}/space/label/binging/`+id+data,
    method: 'post',
    // data
  })
}
