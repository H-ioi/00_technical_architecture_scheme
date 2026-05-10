import request from '@/router/axios'
/**
 * 获取所有已启用的省份
 */
export function getProvince() {
    return request({
        url: '/publik/region/get/province',
        method: 'get',
    })
}
/**
 * 根据区域id集合获取区域
 */
export function getRegionList(data) {
    return request({
        url: '/publik/region/get/list',
        method: 'get',
        params: data
    })
}
/**
 * 获取区域下所有已启用的子级
 */
export function getRegionChild(id, data) {
    return request({
        url: '/publik/region/get/child/' + id,
        method: 'get',
        params: data
    })
}
/**
 * 详情
 */
export function getRegionDetail(id) {
    return request({
        url: '/publik/region/get/' + id,
        method: 'get',
    })
}
/**
 * 启用行业
 */
export function enableRegion(data, id) {
    return request({
        url: '/publik/region/enable/' + id,
        method: 'post',
        data: data
    })
}
/**
 * 禁用行业
 */
export function disableRegion(data, id) {
    return request({
        url: '/publik/region/disable/' + id,
        method: 'post',
        data: data
    })
}
/**
 * 删除行业
 */
export function delRegion(id) {
    return request({
        url: '/publik/region/del/' + id,
        method: 'delete',
    })
}
/**
 * 新增行业
 */
export function addRegion(data) {
    return request({
        url: '/publik/region/add',
        method: 'post',
        data: data
    })
}
/**
 * 编辑行业
 */
export function editRegion(data) {
    return request({
        url: '/publik/region/edit',
        method: 'put',
        data: data
    })
}