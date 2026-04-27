import request from '@/router/axios'
/**
 * 草稿列表
 */
export function getDraftList(data) {
    return request({
        url: '/card/web/content/paginateDraft',
        method: 'get',
        params: data
    })
}
/**
 * 内容(需求/资源)-草稿详情
 */
export function getDraftDetail(id) {
    return request({
        url: '/card/web/content/draft/get/' + id,
        method: 'get',
    })
}
/**
 * 新增草稿
 */
export function addDraft(data) {
    return request({
        url: '/card/web/content/draft/add',
        method: 'post',
        data: data
    })
}
/**
 * 编辑草稿
 */
export function editDraft(data) {
    return request({
        url: '/card/web/content/draft/edit',
        method: 'post',
        data: data
    })
}
/**
 * 草稿提交审核
 */
export function draftAudit(data) {
    return request({
        url: '/card/web/content/draft/audit/submit',
        method: 'post',
        data: data
    })
}
/**
 * 删除草稿
 */
export function delDraft(id) {
    return request({
        url: '/card/web/content/draft/del/' + id,
        method: 'delete',
    })
}
