import request from '@/router/axios'
const path = "/workspace"
/**
 * 获取层级属性列表
 */
export function getSpaceHierarchyList(data, spaceId) {
  return request({
    url: `${path}/space/hierarchy/page/${spaceId}`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 编辑层级属性
 */
export function editSpaceHierarchy(data) {
  return request({
    url: `${path}/space/hierarchy/update`,
    method: 'put',
    data
  })
}
/**
 * 增加层级属性
 */
 export function addSpaceHierarchy(data) {
  return request({
    url: `${path}/space/hierarchy/save`,
    method: 'post',
    data
  })
}
/**
 * 禁用
 */
export function disableSpaceHierarchy(id) {
  return request({
    url: `${path}/space/hierarchy/disable/${id}`,
    method: 'post',
  })
}
/**
 * 启用
 */
export function enableSpaceHierarchy(id) {
  return request({
    url: `${path}/space/hierarchy/enable/${id}`,
    method: 'post',
  })
}
/**
 * 查看详情
 */
export function getSpaceHierarchyDeatil(id) {
  return request({
    url: `${path}/space/hierarchy/get/${id}`,
    method: 'get',
  })
}
/**
 * 查看空间绑定层级信息
 */
 export function getSpaceLevelDeatil(id) {
  return request({
    url: `${path}/space/hierarchy/get/level/${id}`,
    method: 'get',
  })
}
