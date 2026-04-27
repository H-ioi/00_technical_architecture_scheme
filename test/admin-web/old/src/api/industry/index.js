import request from '@/router/axios'
/**
 * 获取所有已启用的最顶级行业
 */
export function getIndustryTop() {
    return request({
        url: '/publik/industry/get/top',
        method: 'get',
    })
}
/**
 * 获取所有已启用的子集
 */
export function getIndustryChild(id) {
    return request({
        url: '/publik/industry/get/child/' + id,
        method: 'get',
    })
}
/**
 * 详情
 */
export function getIndustryDetail(id) {
    return request({
        url: '/publik/industry/get/' + id,
        method: 'get',
    })
}
/**
 * 启用行业
 */
export function enableIndustry(data, id) {
    return request({
        url: '/publik/industry/enable/' + id,
        method: 'post',
        data: data
    })
}
/**
 * 禁用行业
 */
export function disableIndustry(data, id) {
    return request({
        url: '/publik/industry/disable/' + id,
        method: 'post',
        data: data
    })
}
/**
 * 删除行业
 */
export function delIndustry(id) {
    return request({
        url: '/publik/industry/del/' + id,
        method: 'delete',
        data: { id: id }
    })
}
/**
 * 新增行业
 */
export function addIndustry(data) {
    return request({
        url: '/publik/industry/add',
        method: 'post',
        data: data
    })
}
/**
 * 编辑行业
 */
export function editIndustry(data) {
    return request({
        url: '/publik/industry/edit',
        method: 'put',
        data: data
    })
}