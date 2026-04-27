import request from '@/router/axios'
/**
 * 职业认证分页查询
 */
export function getPositionList(data) {
    return request({
        url: '/card/card/position/cert/page',
        method: 'get',
        params: data
    })
}
/**
 * 查询详情
 */
export function getPositionDetail(id) {
    return request({
        url: '/card/card/position/cert/' + id,
        method: 'get',
    })
}

/**
 * 取消认证
 */
export function cancelPosition(data, id) {
    return request({
        url: '/card/card/position/cert/cancel/' + id,
        method: 'post',
        data: data
    })
}
/**
 * 通过认证
 */
export function passPosition(data) {
    return request({
        url: '/card/card/position/cert/pass',
        method: 'post',
        data: data
    })
}
/**
 * 拒绝认证
 */
export function rejectPosition(data) {
    return request({
        url: '/card/card/position/cert/reject',
        method: 'post',
        data: data
    })
}
