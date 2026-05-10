import request from '@/router/axios'
// 消息中心
export function fetchMyMessage(query) {
  return request({
    url: '/publik/message/my/page',
    method: 'get',
    params: query
  })
}
export function fetchMessage(query) {
  return request({
    url: '/publik/message/page',
    method: 'get',
    params: query
  })
}
export function fetchMessageCount(query) {
  return request({
    url: '/publik/message/get/my/count',
    method: 'get',
    params: query
  })
}
export function fetchMessageUnread() {
  return request({
    url: '/publik/message/get/unread/count',
    method: 'get',
  })
}
export function getMessageDetail(id) {
  return request({
    url: '/publik/message/' + id,
    method: 'get',
  })
}

export function delMessage(id) {
  return request({
    url: '/publik/message/' + id,
    method: 'delete',
  })
}

export function postMessage(obj) {
  return request({
    url: '/publik/message/read',
    method: 'post',
    data: obj
  })
}
export function saveMessage(obj) {
  return request({
    url: '/publik/message/save',
    method: 'post',
    data: obj
  })
}
export function getAuditDetail(id) {
  return request({
    url: '/publik/audit/' + id,
    method: 'get',
  })
}
export function allMessageRead() {
  return request({
    url: '/publik/message/read/all',
    method: 'post',
  })
}
export function readMessages(data) {
  return request({
    url: '/publik/message/read',
    method: 'post',
    data: data
  })
}
export function readThisMessages(id) {
  return request({
    url: '/publik/message/read?id='+id,
    method: 'post',
  })
}
// 审核
export function getExtension(id) {
  return request({
    url: '/opportunity/opportunity/get/extension/' + id,
    method: 'get',
  })
}
export function passExtension(obj) {
  return request({
    url: '/opportunity/opportunity/extension/audit/pass',
    method: 'post',
    data: obj
  })
}

export function rejectExtension(obj) {
  return request({
    url: '/opportunity/opportunity/extension/audit/reject',
    method: 'post',
    data: obj
  })
}
export function passClaim(obj) {
  return request({
    url: '/clue/clue/claim/audit/pass',
    method: 'post',
    data: obj
  })
}
export function rejectClaim(obj) {
  return request({
    url: '/clue/clue/claim/audit/reject',
    method: 'post',
    data: obj
  })
}
export function passClose(obj) {
  return request({
    url: '/clue/clue/close/audit/pass',
    method: 'post',
    data: obj
  })
}
export function rejectClose(obj) {
  return request({
    url: '/clue/clue/close/audit/reject',
    method: 'post',
    data: obj
  })
}
export function fetchAuditCount(query) {
  return request({
    url: '/publik/audit/getCountByCode',
    method: 'get',
    params: query
  })
}

