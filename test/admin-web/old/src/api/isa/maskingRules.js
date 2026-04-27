import request from '@/router/axios'
const path = '/isadatacenter/maskingRules'
/**
 * 脱敏规则-脱敏方式下拉框
 */
export function getMaskingMethodList() {
  return request({
    url: `${path}/getMaskingMethodList`,
    method: 'get',
  })
}
/**
 * 脱敏规则-分页
 */
export function getMaskingRulesPage(query) {
  return request({
    url: `${path}/paginate`,
    method: 'get',
    params: query
  })
}
/**
 * 脱敏规则-编辑查看
 */
export function getMaskingRulesDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: 'get',
  })
}
/**
 * 脱敏规则-新增
 */
export function addMaskingRules(data) {
  return request({
    url: `${path}/add`,
    method: 'post',
    data: data
  })
}
/**
 * 脱敏规则-编辑
 */
export function editMaskingRules(data) {
  return request({
    url: `${path}/edit`,
    method: 'post',
    data: data
  })
}
/**
 * 脱敏规则-修改状态
 */
export function editMaskingRulesStatus(data) {
  return request({
    url: `${path}/editStatus`,
    method: 'post',
    data: data
  })
}
/**
 * 脱敏规则-删除
 */
export function delMaskingRules(data) {
  return request({
    url: `${path}/del`,
    method: 'delete',
    data: data
  })
}
