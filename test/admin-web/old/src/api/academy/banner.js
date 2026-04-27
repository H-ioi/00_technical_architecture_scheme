import request from '@/router/axios'
const path = '/isaic/banner/'
/**
 * 轮播图列表
 */
export function getBannerPage(data) {
  return request({
    url: `${path}page`,
    method: 'get',
    params: { ...data },
  })
}
/**
 * 轮播图详情
 */
export function getBannerDetail(id) {
  return request({
    url: `${path}get/${id}`,
    method: 'get',
  })
}

/**
 * 新增轮播图
 */
export function addBanner(obj) {
  return request({
    url: `${path}save`,
    method: 'post',
    data: obj
  })
}
/**
 * 编辑轮播图
 */
export function putBanner(obj) {
  return request({
    url: `${path}update`,
    method: 'put',
    data: obj
  })
}
/**
 * 下架轮播图
 */
export function downBanner(id) {
  return request({
    url: `${path}release/down/${id}`,
    method: 'put',
  })
}
/**
 * 上架轮播图
 */
export function upBanner(id) {
  return request({
    url: `${path}release/up/${id}`,
    method: 'put',
  })
}
/**
 * 删除轮播图
 */
export function delBanner(id) {
  return request({
    url: `${path}del/${id}`,
    method: 'delete',
  })
}
