import request from '@/router/axios'

export function addType(obj) {
  return request({
    url: '/publik/dict/item/add',
    method: 'post',
    data: obj
  })
}
export function putDisable(id) {
  return request({
    url: `/publik/dict/item/disable/${id}`,
    method: 'put',
  })
}
export function putEnable(id) {
  return request({
    url: `/publik/dict/item/enable/${id}`,
    method: 'put',
  })
}
export function putEdit(obj) {
  return request({
    url: `/publik/dict/item/edit`,
    method: 'put',
    data: obj
  })
}
export function fetchTypeList(type) {
  return request({
    url: `/publik/dict/item/get/${type}`,
    method: 'get',
  })
}
export function delType(id) {
  return request({
    url: '/publik/dict/item/del/' + id,
    method: 'delete'
  })
}
// 合同模板接口
export function addContractTemplate(obj) {
  return request({
    url: '/contract/contract/template/add',
    method: 'post',
    data: obj
  })
}
export function putDisableContractTemplate(id) {
  return request({
    url: `/contract/contract/template/disable//${id}`,
    method: 'put',
  })
}
export function putEnableContractTemplate(id) {
  return request({
    url: `/contract/contract/template/enable/${id}`,
    method: 'put',
  })
}
export function putEditContractTemplate(obj) {
  return request({
    url: `/contract/contract/template/edit`,
    method: 'put',
    data: obj
  })
}
export function fetchContractTemplate() {
  return request({
    url: `/contract/contract/template/list`,
    method: 'get',
  })
}
export function delContractTemplate(id) {
  return request({
    url: '/contract​/contract​/template​/del​' + id,
    method: 'delete'
  })
}
// 机制审核
export function fetchAuditInfo(obj) {
  return request({
    url: `publik/audit/conf/get/one`,
    method: 'get',
    params: { ...obj },
  })
}
export function putAuditInfo(data) {
  return request({
    url: `publik/audit/conf/update`,
    method: 'put',
    data: data
  })
}
export function fetchMechanismInfo(obj) {
  return request({
    url: `publik/mechanism/conf/get/one`,
    method: 'get',
    params: { ...obj },
  })
}
export function putMechanism(data) {
  return request({
    url: `publik/mechanism/conf/update`,
    method: 'put',
    data: data
  })
}
// 邮件类型
export function getEmailList(id) {
  return request({
    url: `/workorder/email/send/config/get/${id}`,
    method: 'get',
  })
}
export function getEmailPage(obj) {
  return request({
    url: `/workorder/email/send/config/page`,
    method: 'get',
    params: { ...obj },
  })
}
export function updateEmail(data) {
  return request({
    url: `/workorder/email/send/config/update`,
    method: 'put',
    data: data
  })
}


