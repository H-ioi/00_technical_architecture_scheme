import request from '@/router/axios'
const student = '/isaic/student/'
const parent = '/isaic/parent/'
/**
 * 学生列表
 */
export function getstudentPage(data) {
  return request({
    url: `${student}paginate`,
    method: 'get',
    params: { ...data },
  })
}
/**
 * 学生详情
 */
export function getStudentDetail(id) {
  return request({
    url: `${student}detail/${id}`,
    method: 'get',
  })
}
/**
 * 关联学生家长
 */
export function getStudentByParent(id) {
  return request({
    url: `${student}listByParent/${id}`,
    method: 'get',
  })
}
/**
 * 家长列表
 */
export function getParentPage(data) {
  return request({
    url: `${parent}paginate`,
    method: 'get',
    params: { ...data },
  })
}
/**
 * 家长详情
 */
export function getParentDetail(id) {
  return request({
    url: `${parent}detail/${id}`,
    method: 'get',
  })
}
/**
 * 家长账号启用
 */
export function getParentToggle(id) {
  return request({
    url: `${parent}toggle/active/${id}`,
    method: 'put',
  })
}
/**
 * 下载
 */
export function exportParent(data) {
  return request({
    url: `${parent}export`,
    method: 'get',
    params: data,
    header: {
      headers: {
        "Content-Type": "application/x-download"
      }
    },
    responseType: "blob"
  })
}

