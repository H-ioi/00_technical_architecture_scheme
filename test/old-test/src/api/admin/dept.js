

import request from '@/router/axios'

export function fetchTree(query) {
  return request({
    url: '/upms/dept/tree',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/upms/dept/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/upms/dept/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/upms/dept/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/upms/dept/',
    method: 'put',
    data: obj
  })
}
