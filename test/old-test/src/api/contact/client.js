import request from '@/router/axios'

export function fetchClientList(query) {
  return request({
    url: '/contact/client/paginate/own',
    method: 'get',
    params: query
  })
}
export function fetchClientListWare(query) {
  return request({
    url: '/contact/client/paginate/ware',
    method: 'get',
    params: query
  })
}

/**
 * 导出客户
 */
export function getExport(query) {
  return request({
    url: '/contact/client/export',
    method: 'get',
    params: query,
    header: {
      headers: {
        "Content-Type": "application/x-download"
      }
    },
    responseType: "blob"
  })
}
/**
 * 新增客户
 */
export function addObj(obj) {
  return request({
    url: '/contact/client/add',
    method: 'post',
    data: obj
  })
}
/**
 * 客户设置标签
 */
export function playTags(obj, id) {
  return request({
    url: '/contact/client/tag/' + id,
    method: 'post',
    data: obj
  })
}
/**
 * 客户详情
 */
export function getClientDetail(id) {
  return request({
    url: '/contact/client/get/' + id,
    method: 'get'
  })
}
/**
 * 客户财务信息
 */
export function getFinance(id) {
  return request({
    url: '/contact/client/finance/list/' + id,
    method: 'get',
  })
}
/**
 * 客户财务信息
 */
export function getFinanceInfo(id) {
  return request({
    url: '/contact/client/finance/get/' + id,
    method: 'get',
  })
}
/**
 * 添加客户财务信息
 */
export function addFinanceInfo(obj) {
  return request({
    url: '/contact/client/finance/add',
    method: 'post',
    data: obj
  })
}
/**
 * 添加客户财务信息
 */
export function editFinanceInfo(obj) {
  return request({
    url: '/contact/client/finance/edit',
    method: 'put',
    data: obj
  })
}
/**
 * 编辑客户
 */
export function putClient(obj) {
  return request({
    url: '/contact/client/edit',
    method: 'put',
    data: obj
  })
}

/**
 * 启用客户
 */
export function enableClient(id) {
  return request({
    url: '/contact/client/enable/' + id,
    method: 'put',
  })
}
/**
 * 禁用客户
 */
export function disableClient(id) {
  return request({
    url: '/contact/client/disable/' + id,
    method: 'put',
  })
}

/**
 * 删除联系人
 */
export function delClient(id) {
  return request({
    url: '/contact/client/del/' + id,
    method: 'delete'
  })
}
export function delFinance(id) {
  return request({
    url: '/contact/client/finance/del/' + id,
    method: 'delete'
  })
}

export function availableName(data) {
  return request({
    url: '/contact/client/name/available',
    method: 'get',
    params: data
  })
}
