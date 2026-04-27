import request from '@/router/axios'
const path = '/isaic/competition/'
/**
 * 活动列表
 */
export function getCompetitionPage(query) {
  return request({
    url: `${path}page`,
    method: 'get',
    params: query,
  })
}
/**
 * 所有子活动列表
 */
export function getCompetitionChild(id = '') {
  return request({
    url: `${path}list/child` + `${id == '' ? '' : `?ignoreId=` + id}`,
    method: 'get',
  })
}
/**
 * 所有活动列表
 */
export function getAllCompetition() {
  return request({
    url: `${path}list/all`,
    method: 'get',
  })
}
/**
 * 活动详情
 */
export function getCompetitionDetail(id) {
  return request({
    url: `${path}get/${id}`,
    method: 'get',
  })
}

/**
 * 新增活动
 */
export function addCompetition(obj) {
  return request({
    url: `${path}save`,
    method: 'post',
    data: obj
  })
}
/**
 * 编辑活动
 */
export function putCompetition(obj) {
  return request({
    url: `${path}update`,
    method: 'put',
    data: obj
  })
}
/**
 * 下架活动
 */
export function downCompetition(id) {
  return request({
    url: `${path}release/down/${id}`,
    method: 'put',
  })
}
/**
 * 上架活动
 */
export function upCompetition(id) {
  return request({
    url: `${path}release/up/${id}`,
    method: 'put',
  })
}
/**
 * 删除活动
 */
export function delCompetition(id) {
  return request({
    url: `${path}del/${id}`,
    method: 'delete',
  })
}
/**
 * 下载活动报名列表
 */
export function downloadCompetitionSignup(id) {
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
