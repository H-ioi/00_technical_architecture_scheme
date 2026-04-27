

import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/upms/route',
    method: 'get',
    params: query
  })
}

export function putObj(obj) {
  return request({
    url: '/upms/route',
    method: 'put',
    data: obj
  })
}

export function refreshObj() {
  return request({
    url: '/actuator/refresh',
    method: 'post'
  })
}
