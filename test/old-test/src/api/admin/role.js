

import request from '@/router/axios'

export function roleList() {
  return request({
    url: '/upms/role/roleList',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: '/upms/role/page',
    method: 'get',
    params: query
  })
}

export function deptRoleList() {
  return request({
    url: '/upms/role/list',
    method: 'get'
  })
}

export function getObj(id) {
  return request({
    url: '/upms/role/' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/upms/role',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/upms/role',
    method: 'put',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/upms/role/' + id,
    method: 'delete'
  })
}

export function permissionUpd(roleId, menuIds) {
  return request({
    url: '/upms/role/menu',
    method: 'put',
    data: {
      roleId: roleId,
      menuIds: menuIds
    }
  })
}

export function fetchRoleTree(roleId) {
  return request({
    url: '/upms/menu/role/' + roleId,
    method: 'get'
  })
}
export function getAlltype(obj) {
  return request({
    url: '/publik/dict/item/get/types',
    method: 'get',
    params: obj
  })
}
