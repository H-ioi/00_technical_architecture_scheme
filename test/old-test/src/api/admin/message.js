import request from '@/router/axios'
export function getMessage(query) {
    return request({
        url: '/publik/message/page',
        method: 'get',
        params: query
    })
}
export function addMessageNotice(obj) {
    return request({
        url: '/publik/message/save/notice',
        method: 'post',
        data: obj
    })
}
export function updateMessageNotice(obj) {
    return request({
        url: '/publik/message/update/notice',
        method: 'put',
        data: obj
    })
}
export function getMessageDetail(id) {
    return request({
        url: '/publik/message/notice/get/' + id,
        method: 'get',
    })
}
export function delMessage(id) {
    return request({
        url: '/publik/message/' + id,
        method: 'delete',
    })
}
export function getUserAll() {
    return request({
        url: '/upms/user/all',
        method: 'get',
    })
}
export function getUserids(query) {
    return request({
        url: '/upms/user/ids',
        method: 'get',
        params: query
    })
}
export function getCardUser(query) {
    return request({
        url: '/card/web/card/user/list',
        method: 'get',
    })
}