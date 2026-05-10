

import request from '@/router/axios'

export function getObj(id) {
  return request({
    url: '/mp/wxmenu/' + id,
    method: 'get'
  })
}

export function saveObj(appId,data) {
  return request({
    url: '/mp/wxmenu/' + appId,
    method: 'post',
    data: data
  })
}

export function publishObj(id) {
  return request({
    url: '/mp/wxmenu/' + id,
    method: 'put'
  })
}
