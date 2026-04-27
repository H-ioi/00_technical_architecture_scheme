import request from '@/router/axios'
/**
 * 内容-分页列表展示
 */
export function getContentList(data) {
    return request({
        url: '/card/web/content/paginateContent',
        method: 'get',
        params: data
    })
}
/**
 * 内容(需求/资源)-详情
 */
export function getContentDetail(id) {
    return request({
        url: '/card/web/content/get/' + id,
        method: 'get',
    })
}
/**
 * 内容(需求/资源)-审核
 */
export function auditContent(data) {
    return request({
        url: '/card/web/content/audit',
        method: 'post',
        data: data
    })
}
/**
 * 内容(需求/资源)-审核通过
 */
export function contentPass(id) {
    return request({
        url: '/card/web/content/audit/pass/' + id,
        method: 'put',
    })
}
/**
 * 内容(需求/资源)-审核不通过
 */
export function contentReject(id) {
    return request({
        url: '/card/web/content/audit/reject/' + id,
        method: 'put',
    })
}
/**
 * 内容(需求/资源)-审核下架
 */
export function contentDisable(id) {
    return request({
        url: '/card/web/content/publish/disable/' + id,
        method: 'put',
    })
}
/**
 * 内容(需求/资源)-审核上架
 */
export function contentEnable(id) {
    return request({
        url: '/card/web/content/publish/enable/' + id,
        method: 'put',
    })
}
