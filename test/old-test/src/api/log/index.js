import request from '@/router/axios'
/**
 * 跟进记录
 */
export function getLogList(data) {
    return request({
        url: '/publik/record/page',
        method: 'get',
        params: { ...data },
    })
}
/**
 * 跟进记录
 */
export function getMiniLogList(data) {
    return request({
        url: '/publik/record/mini/page',
        method: 'get',
        params: { ...data },
    })
}
/**
 * 跟进记录详情
 */
export function getLogDetail(id) {
    return request({
        url: '/publik/record/' + id,
        method: 'get',
    })
}
/**
 * 新增跟进记录
 */
export function postLogList(data) {
    return request({
        url: '/publik/record',
        method: 'post',
        data: data
    })
}
/**
 * 编辑跟进记录
 */
export function editLogList(data) {
    return request({
        url: '/publik/record',
        method: 'put',
        data: data
    })
}
/**
 * 跟进日志
 */
export function getLogPage(data) {
    return request({
        url: '/publik/log/page',
        method: 'get',
        params: { ...data },
    })
}
/**
 * 删除跟进记录
 */
export function delLog(id) {
    return request({
        url: '/publik/record/' + id,
        method: 'delete',
    })
}