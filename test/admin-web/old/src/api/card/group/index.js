import request from '@/router/axios'
/**
 * 名片组
 */
export function getCardGroup(data) {
    return request({
        url: '/card/web/card/group/page',
        method: 'get',
        params: data
    })
}
export function addCardGroup(data) {
    return request({
        url: '/card/web/card/group/add',
        method: 'post',
        data: data
    })
}
export function editCardGroup(data) {
    return request({
        url: '/card/web/card/group/edit',
        method: 'put',
        data: data
    })
}
export function delCardPage(data) {
    return request({
        url: '/card/web/card/group/del',
        method: 'delete',
        data: data
    })
}