import request from '@/router/axios'
const path = "/workspace"
/**
 * 空间使用列表
 */
export function getSpaceUsageList(spaceId) {
  return request({
    url: `${path}/space/usage/list/${spaceId}`,
    method: 'get',

  })
}
/**
 * 新增空间使用
 */
export function addUsageSpace(data) {
  return request({
    url: `${path}/space/usage/save`,
    method: 'post',
    data
  })
}
/**
 * 编辑空间使用
 */
export function putSpaceUsage(data) {
  return request({
    url: `${path}/space/usage/update`,
    method: 'put',
    data
  })
}
/**
 * 删除空间使用
 */
export function delSpaceUsage(id) {
  return request({
    url: `${path}/space/usage/${id}`,
    method: 'delete',
  })
}
/**
 * 使用列表
 */
export function getSpaceUsagePage(data, spaceId) {
  return request({
    url: `${path}/space/usage/page/${spaceId}`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 导出
 */
export function downloadSpaceUsage(id,data) {
  return request({
    url: `${path}/space/usage/export/`+id,
    method: 'get',
    params: {
      ...data
    },
    header: {
      headers: {
        "Content-Type": "application/x-download"
      }
    },
    responseType: "blob"
  })
}
/**
 * 顶级空间使用看板列表
 */
export function getSpaceUsageBoard(data,spaceId) {
  return request({
    url: `${path}/space/usage/list/board/${spaceId}`,
    method: 'get',
    params: {
      ...data
    },
  })
}
