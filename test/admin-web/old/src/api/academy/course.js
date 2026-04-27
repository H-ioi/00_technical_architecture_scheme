import request from '@/router/axios'
const path = '/isaic/course/'
/**
 * 课程列表
 */
export function getCoursePage(query) {
  return request({
    url: `${path}page`,
    method: 'get',
    params: query,
  })
}
/**
 * 所有子课程列表
 */
export function getCourseChild(id = '') {
  return request({
    url: `${path}list/child` + `${id == '' ? '' : `?ignoreId=` + id}`,
    method: 'get',
  })
}
/**
 * 所有课程列表
 */
export function getAllCourse() {
  return request({
    url: `${path}list/all`,
    method: 'get',
  })
}
/**
 * 课程详情
 */
export function getCourseDetail(id) {
  return request({
    url: `${path}get/${id}`,
    method: 'get',
  })
}

/**
 * 新增课程
 */
export function addCourse(obj) {
  return request({
    url: `${path}save`,
    method: 'post',
    data: obj
  })
}
/**
 * 编辑课程
 */
export function putCourse(obj) {
  return request({
    url: `${path}update`,
    method: 'put',
    data: obj
  })
}
/**
 * 下架课程
 */
export function downCourse(id) {
  return request({
    url: `${path}release/down/${id}`,
    method: 'put',
  })
}
/**
 * 上架课程
 */
export function upCourse(id) {
  return request({
    url: `${path}release/up/${id}`,
    method: 'put',
  })
}
/**
 * 删除课程
 */
export function delCourse(id) {
  return request({
    url: `${path}del/${id}`,
    method: 'delete',
  })
}
/**
 * 下载课程报名列表
 */
export function downloadCourseSignup(id) {
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
