import request from '@/router/axios'
const path = "/workorder/periodic/plan"
/**
 * 获取周期计划列表
 */
export function getOrderPlanList(data) {
    return request({
        url: `${path}/page`,
        method: 'get',
        params: data
    })
}
/**
 * 周期计划列表详情
 */
export function getOrderPlanDetail(id) {
    return request({
        url: `${path}/get/${id}`,
        method: 'get',
    })
}
/**
 * 新增周期计划
 */
export function addOrderPlan(data) {
    return request({
        url: `${path}/save`,
        method: 'post',
        data: data
    })
}
/**
 * 编辑周期计划
 */
export function editOrderPlan(data) {
    return request({
        url: `${path}/update`,
        method: 'put',
        data: data
    })
}
/**
 * 启用周期计划
 */
export function enableOrderPlan(id) {
    return request({
        url: `${path}/enable/${id}`,
        method: 'post',
    })
}
/**
 * 禁用周期计划
 */
export function disableOrderPlan(id) {
    return request({
        url: `${path}/disable/${id}`,
        method: 'post',
    })
}
/**
 * 删除周期计划
 */
export function delOrderPlan(id) {
    return request({
        url: `${path}/del/${id}`,
        method: 'delete',
    })
}