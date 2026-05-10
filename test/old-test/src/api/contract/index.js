import request from '@/router/axios'

export function fetchOwnList(query) {
  return request({
    url: '/contract/contract/paginate/own',
    method: 'get',
    params: query
  })
}
export function fetchWareList(query) {
  return request({
    url: '/contract/contract/paginate/ware',
    method: 'get',
    params: query
  })
}
export function getContractDetail(id) {
  return request({
    url: '/contract/contract/get/' + id,
    method: 'get'
  })
}
export function putContract(obj) {
  return request({
    url: '/contract/contract/edit',
    method: 'put',
    data: obj
  })
}
export function getContractClient(id) {
  return request({
    url: '/contract/contract/get/client/' + id,
    method: 'get'
  })
}
// 履约记录
export function getPerformance(id) {
  return request({
    url: '/contract/contract/performance/get/' + id,
    method: 'get',
  })
}
export function getPerformanceList(id) {
  return request({
    url: '/contract/contract/performance/list/' + id,
    method: 'get',
  })
}
export function putPerformance(obj) {
  return request({
    url: '/contract/contract/performance/edit',
    method: 'put',
    data: obj
  })
}
export function addPerformance(obj) {
  return request({
    url: '/contract/contract/performance/add',
    method: 'post',
    data: obj
  })
}
export function delPerformance(id) {
  return request({
    url: '/contract/contract/performance/del/' + id,
    method: 'delete',
  })
}
export function fetchOwnChart(query) {
  return request({
    url: '/contract/contract/chart/addiction/num/own',
    method: 'get',
    params: query
  })
}
export function fetchSignupChart(query) {
  return request({
    url: '/contract/contract/chart/addiction/amount/signup/own',
    method: 'get',
    params: query
  })
}
