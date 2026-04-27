

import request from '@/router/axios'

export function getMenu(id) {
  return request({
    url: '/upms/menu/user',
    params: {parentId: id},
    method: 'get'
  })
}

export function getTopMenu() {
  return request({
    url: '/upms/menu',
    params: {type: 'top'},
    method: 'get'
  })
}

export function fetchMenuTree(lazy, parentId) {
  return request({
    // url: '/upms/menu/tree',
    url: '/upms/menu/tenant/get',
    method: 'get',
    params: {lazy: lazy, parentId: parentId}
  })
}

export function addObj(obj) {
  return request({
    url: '/upms/menu',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/upms/menu/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/upms/menu/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/upms/menu/tenant/edit',
    method: 'post',
    data: obj
  })
}
