

import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/upms/user/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/upms/user',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/upms/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/upms/user/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/upms/user',
    method: 'put',
    data: obj
  })
}

export function getDetails(obj) {
  return request({
    url: '/upms/user/details/' + obj,
    method: 'get'
  })
}

// 更改个人信息
export function editInfo(obj) {
  return request({
    url: '/upms/user/edit',
    method: 'put',
    data: obj
  })
}
export function getUserlist(obj) {
  return request({
    url: '/upms/user/ids',
    method: 'get',
    params: obj
  })
}
export function downloadTemplate() {
  return request({
    url: '/upms/user/download',
    method: 'get',
    header: {
      headers: {
        "Content-Type": "application/x-download"
      }
    },
    responseType: "blob"
  })
}
export function importObj(obj) {
  return request({
    url: '/upms/user/import',
    method: 'post',
    data: obj
  })
}

