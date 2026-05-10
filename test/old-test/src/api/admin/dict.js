

import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/upms/dict/page',
    method: 'get',
    params: query
  })
}

export function fetchItemList(query) {
  return request({
    url: '/upms/dict/item/page',
    method: 'get',
    params: query
  })
}

export function addItemObj(obj) {
  return request({
    url: '/upms/dict/item',
    method: 'post',
    data: obj
  })
}

export function getItemObj(id) {
  return request({
    url: '/upms/dict/item/' + id,
    method: 'get'
  })
}

export function delItemObj(id) {
  return request({
    url: '/upms/dict/item/' + id,
    method: 'delete'
  })
}

export function putItemObj(obj) {
  return request({
    url: '/upms/dict/item',
    method: 'put',
    data: obj
  })
}

export function addObj(obj) {
  return request({
    url: '/upms/dict/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/upms/dict/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/upms/dict/' + row.id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/upms/dict/',
    method: 'put',
    data: obj
  })
}

export function remote(type) {
  return request({
    url: '/upms/dict/type/' + type,
    method: 'get'
  })
}
