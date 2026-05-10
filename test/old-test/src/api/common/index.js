import request from '@/router/axios'

export function fetchList(type) {
  return request({
    url: `/publik/dict/item/get/${type}`,
    method: 'get',
  })
}