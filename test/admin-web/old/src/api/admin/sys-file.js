

import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/upms/sys-file/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/upms/sys-file',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/upms/sys-file/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/upms/sys-file/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/upms/sys-file',
    method: 'put',
    data: obj
  })
}
