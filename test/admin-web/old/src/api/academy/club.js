import request from '@/router/axios'
const path = '/isaic/club/'
/**
 * 俱乐部列表
 */
export function getClubPage(query) {
  return request({
    url: `${path}page`,
    method: 'get',
    params: query,
  })
}
/**
 * 所有子俱乐部列表
 */
export function getClubChild(id = '') {
  return request({
    url: `${path}list/child` + `${id == '' ? '' : `?ignoreId=` + id}`,
    method: 'get',
  })
}
/**
 * 俱乐部详情
 */
export function getClubDetail(id) {
  return request({
    url: `${path}get/${id}`,
    method: 'get',
  })
}

/**
 * 新增俱乐部
 */
export function addClub(obj) {
  return request({
    url: `${path}save`,
    method: 'post',
    data: obj
  })
}
/**
 * 编辑俱乐部
 */
export function putClub(obj) {
  return request({
    url: `${path}update`,
    method: 'put',
    data: obj
  })
}
/**
 * 下架俱乐部
 */
export function downClub(id) {
  return request({
    url: `${path}release/down/${id}`,
    method: 'put',
  })
}
/**
 * 上架俱乐部
 */
export function upClub(id) {
  return request({
    url: `${path}release/up/${id}`,
    method: 'put',
  })
}
/**
 * 删除俱乐部
 */
export function delClub(id) {
  return request({
    url: `${path}del/${id}`,
    method: 'delete',
  })
}
/**
 * 下载俱乐部报名列表
 */
export function downloadClubSignup(id) {
  return request({
    url: `${path}download/signup/${id}`,
    method: 'get',
    header: {
      headers: {
        "Content-Type": "application/x-download"
      }
    },
    responseType: "blob"
  })
}
