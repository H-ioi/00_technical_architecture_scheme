import request from '@/router/axios'
const path = "/workspace"
/**
 * 空间预定列表
 */
export function getSpaceReserveList(data, spaceId) {
  return request({
    url: `${path}/space/reserve/list/${spaceId}`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 顶级空间预定列表
 */
export function getSpaceReservePage(data, spaceId) {
  return request({
    url: `${path}/space/reserve/page/${spaceId}`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 顶级空间预定看板列表
 */
 export function getSpaceBoardList(data,spaceId) {
  return request({
    url: `${path}/space/reserve/list/board/${spaceId}`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 新增空间预定
 */
export function addReserveSpace(data) {
  return request({
    url: `${path}/space/reserve/save`,
    method: 'post',
    data
  })
}
/**
 * 编辑空间预定
 */
export function putSpaceReserve(data) {
  return request({
    url: `${path}/space/reserve/update`,
    method: 'put',
    data
  })
}
/**
 * 删除空间预定
 */
export function delSpaceReserve(id) {
  return request({
    url: `${path}/space/reserve/${id}`,
    method: 'delete',
  })
}
/**
 * 刷新预定
 */
 export function getSpaceReserve(id) {
  return request({
    url: `${path}/space/reserve/${id}`,
    method: 'get',
  })
}
/**
 * 下载模板
 */
 export function downloadSpaceReserve(id,data) {
  return request({
    url: `${path}/space/reserve/export/`+id,
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
