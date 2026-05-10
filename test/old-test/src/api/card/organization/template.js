import request from '@/router/axios'
/**
 * 模板分页查询
 */
export function getTemplateList(data) {
    return request({
        url: '/card/organization/template/page',
        method: 'get',
        params: data
    })
}
/**
 * 查询详情
 */
export function getTemplateDetail(id) {
    return request({
        url: '/card/organization/template/' + id,
        method: 'get',
    })
}
/**
 * 新增模板
 */
export function addTemplate(data) {
    return request({
        url: '/card/organization/template',
        method: 'post',
        data: data
    })
}
/**
 * 新增模板
 */
export function editTemplate(data) {
    return request({
        url: '/card/organization/template',
        method: 'put',
        data: data
    })
}
/**
 * 删除模板
 */
export function delTemplate(id) {
    return request({
        url: '/card/organization/template/' + id,
        method: 'delete',
    })
}
/**
 * 获取全部
 */
export function getTemplateAll(data) {
    return request({
        url: '/card/organization/template/all',
        method: 'get',
        params: data

    })
}