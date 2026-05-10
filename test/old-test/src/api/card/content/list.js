import request from '@/router/axios'
export function addType(obj) {
    return request({
        url: '/card/web/item/add',
        method: 'post',
        data: obj
    })
}
export function putDisable(id) {
    return request({
        url: `/card/web/item/disable/${id}`,
        method: 'put',
    })
}
export function putEnable(id) {
    return request({
        url: `/card/web/item/enable/${id}`,
        method: 'put',
    })
}
export function putEdit(obj) {
    return request({
        url: `/card/web/item/edit`,
        method: 'put',
        data: obj
    })
}
export function fetchTypeList(type) {
    return request({
        url: `/card/web/item/get/${type}`,
        method: 'get',
    })
}
export function delType(id) {
    return request({
        url: '/card/web/item/del/' + id,
        method: 'delete'
    })
}
// 多级字典
export function getDictTree(data) {
    return request({
        url: `/card/web/item/tree`,
        method: 'get',
        data: data
    })
}
export function getDictFieldAll(id) {
    return request({
        url: `/card/web/item/field/` + id,
        method: 'get',
    })
}
export function postDictField(data) {
    return request({
        url: `/card/web/item/field/handle`,
        method: 'post',
        data: data
    })
}
