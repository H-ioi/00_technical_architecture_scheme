import request from '@/router/axios'
const path = '/isaic/activity/'
/**
 * 活动列表
 */
export function getActivityPage(query) {
  return request({
    url: `${path}page`,
    method: 'get',
    params: query,
  })
}
/**
 * 所有子活动列表
 */
export function getActivityChild(id = '') {
  return request({
    url: `${path}list/child` + `${id == '' ? '' : `?ignoreId=` + id}`,
    method: 'get',
  })
}
/**
 * 所有活动列表
 */
export function getAllActivity() {
  return request({
    url: `${path}list/all`,
    method: 'get',
  })
}
/**
 * 活动详情
 */
export function getActivityDetail(id) {
  return request({
    url: `${path}get/${id}`,
    method: 'get',
  })
}

/**
 * 新增活动
 */
export function addActivity(obj) {
  return request({
    url: `${path}save`,
    method: 'post',
    data: obj
  })
}
/**
 * 编辑活动
 */
export function putActivity(obj) {
  return request({
    url: `${path}update`,
    method: 'put',
    data: obj
  })
}
/**
 * 下架活动
 */
export function downActivity(id) {
  return request({
    url: `${path}release/down/${id}`,
    method: 'put',
  })
}
/**
 * 上架活动
 */
export function upActivity(id) {
  return request({
    url: `${path}release/up/${id}`,
    method: 'put',
  })
}
/**
 * 删除活动
 */
export function delActivity(id) {
  return request({
    url: `${path}del/${id}`,
    method: 'delete',
  })
}
/**
 * 下载活动报名列表
 */
export function downloadActivitySignup(id) {
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
