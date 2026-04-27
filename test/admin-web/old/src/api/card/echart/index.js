import request from '@/router/axios'
/**
 * 内容
 */
export function getContentChart(data) {
    return request({
        url: '/card/web/content/chart',
        method: 'get',
        params: data
    })
}
/**
 * 名片
 */
export function getCardChart(data) {
    return request({
        url: '/card/web/card/chart',
        method: 'get',
        params: data
    })
}
/**
 * 职业认证
 */
export function getPositionChart(data) {
    return request({
        url: '/card/card/position/cert/chart',
        method: 'get',
        params: data
    })
}