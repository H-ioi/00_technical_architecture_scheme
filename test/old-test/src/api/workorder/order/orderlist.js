import request from '@/router/axios'
export function addType(obj) {
    return request({
        url: '/publik/dict/item/add',
        method: 'post',
        data: obj
    })
}
export function putDisable(id) {
    return request({
        url: `/publik/dict/item/disable/${id}`,
        method: 'put',
    })
}
export function putEnable(id) {
    return request({
        url: `/publik/dict/item/enable/${id}`,
        method: 'put',
    })
}
export function putEdit(obj) {
    return request({
        url: `/publik/dict/item/edit`,
        method: 'put',
        data: obj
    })
}
export function fetchTypeList(type) {
    return request({
        url: `/publik/dict/item/get/${type}`,
        method: 'get',
    })
}
export function delType(id) {
    return request({
        url: '/publik/dict/item/del/' + id,
        method: 'delete'
    })
}
// 多级字典
export function getDictTree(data) {
    return request({
        url: `/publik/dict/item/tree`,
        method: 'get',
        data: data
    })
}
export function getDictFieldAll(id, query = {}) {
    return request({
        url: `/publik/dict/item/field/` + id,
        method: 'get',
        params: query
    })
}
export function postDictField(data) {
    return request({
        url: `/publik/dict/item/field/handle`,
        method: 'post',
        data: data
    })
}
