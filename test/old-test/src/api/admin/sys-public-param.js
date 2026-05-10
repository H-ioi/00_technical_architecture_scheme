

import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/upms/param/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/upms/param',
    method: 'post',
    data: obj
  })
}

export function getObj(key) {
  return request({
    url: '/upms/param/publicValue/' + key,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/upms/param/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/upms/param',
    method: 'put',
    data: obj
  })
}
