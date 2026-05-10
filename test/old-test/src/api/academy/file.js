import request from '@/router/axios'
const path = '/isaic/mobile/public/file/'
export function uploadFile(data) {
  return request({
    url: `${path}upload`,
    method: 'post',
    data: data
  })
}
export function batchUploadFile(data) {
  return request({
    url: `${path}upload/batch`,
    method: 'post',
    data: data
  })
}
