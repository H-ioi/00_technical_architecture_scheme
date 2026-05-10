import request from '@/router/axios'

export function fetchOpportunityMyList(query) {
  return request({
    url: '/opportunity/opportunity/my/page',
    method: 'get',
    params: query
  })
}
export function fetchArchivesList(query) {
  return request({
    url: `/opportunity/opportunity/archives/page`,
    method: 'get',
    params: query
  })
}
export function fetChconditionsList() {
  return request({
    url: '/opportunity/opportunity/conditions',
    method: 'get',
  })
}
export function getOpportunityByClientId(data) {
  return request({
    url: '/opportunity/opportunity/getByClientId',
    method: 'get',
    params: { ...data },
  })
}

export function addOpportunity(obj) {
  return request({
    url: '/opportunity/opportunity',
    method: 'post',
    data: obj
  })
}

export function getOpportunityDetail(id) {
  return request({
    url: '/opportunity/opportunity/' + id,
    method: 'get'
  })
}

export function delOpportunity(id) {
  return request({
    url: '/opportunity/opportunity/' + id,
    method: 'delete'
  })
}
export function extensionOpportunity(obj) {
  return request({
    url: '/opportunity/opportunity/extension',
    method: 'post',
    data: obj,
  })
}
export function signOpportunity(obj, id) {
  return request({
    url: '/opportunity/opportunity/sign/' + id,
    method: 'post',
    data: obj
  })
}
export function stageOpportunity(obj, id) {
  return request({
    url: '/opportunity/opportunity/update/stage/' + id,
    method: 'post',
    data: obj
  })
}
export function rebackOpportunity(id) {
  return request({
    url: '/opportunity/opportunity/reback/' + id,
    method: 'post',
  })
}

export function getCountOpportunity() {
  return request({
    url: '/opportunity/opportunity/get/index/count',
    method: 'get',
  })
}
export function putOpportunity(obj) {
  return request({
    url: '/opportunity/opportunity',
    method: 'put',
    data: obj
  })
}
export function getStageOpportunity(query) {
  return request({
    url: '/opportunity/opportunity/get/stage/percent',
    method: 'get',
    params: query
  })
}
