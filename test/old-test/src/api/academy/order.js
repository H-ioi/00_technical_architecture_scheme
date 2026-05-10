import request from '@/router/axios'
const path = '/isaic/order/'
/**
 * 主订单列表
 */
export function getTopOrderPage(data) {
  return request({
    url: `${path}paginate`,
    method: 'get',
    params: { ...data },
  })
}
/**
 * 主订单详情
 */
export function getTopOrderDetail(id) {
  return request({
    url: `${path}detail/${id}`,
    method: 'get',
  })
}
/**
 * 关闭订单
 */
export function closeTopOrder(id) {
  return request({
    url: `${path}op/close/${id}`,
    method: 'put',
  })
}
/**
 * 完成订单
 */
export function finishTopOrder(id) {
  return request({
    url: `${path}op/finish/${id}`,
    method: 'put',
  })
}
/**
 * 支付订单
 */
export function payTopOrder(id) {
  return request({
    url: `${path}op/pay/${id}`,
    method: 'put',
  })
}
/**
 * 退款申请
 */
export function refundApplyTopOrder(id) {
  return request({
    url: `${path}op/refund/apply/${id}`,
    method: 'put',
  })
}
/**
 * 取消退款申请
 */
export function refundCancelTopOrder(id) {
  return request({
    url: `${path}op/refund/cancel/${id}`,
    method: 'put',
  })
}
/**
 * 确认退款
 */
export function refundConfirmTopOrder(id) {
  return request({
    url: `${path}op/refund/confirm/${id}`,
    method: 'put',
  })
}
/**
 * 排课
 */
export function scheduleTopOrder(id) {
  return request({
    url: `${path}op/schedule/${id}`,
    method: 'put',
  })
}


/**
 * 关联的子订单列表
 */
export function getChildOrderlist(id) {
  return request({
    url: `${path}sub/list/${id}`,
    method: 'get',
  })
}
/**
 * 子订单详情
 */
export function getchildOrderDetail(id) {
  return request({
    url: `${path}sub/list/${id}`,
    method: 'get',
  })
}
/**
 * 关闭订单
 */
export function closeChildOrder(id) {
  return request({
    url: `${path}sub/op/close/${id}`,
    method: 'put',
  })
}
/**
 * 完成订单
 */
export function finishChildOrder(id) {
  return request({
    url: `${path}sub/op/finish/${id}`,
    method: 'put',
  })
}
/**
 * 退款申请
 */
export function refundApplyChildOrder(id) {
  return request({
    url: `${path}sub/op/refund/apply/${id}`,
    method: 'put',
  })
}
/**
 * 确认退款
 */
export function refundConfirmChildOrder(id) {
  return request({
    url: `${path}sub/op/refund/confirm/${id}`,
    method: 'put',
  })
}
/**
 * 取消退款
 */
export function refundCancelChildOrder(id) {
  return request({
    url: `${path}sub/op/refund/cancel/${id}`,
    method: 'put',
  })
}
/**
 * 排课
 */
export function scheduleChildOrder(id) {
  return request({
    url: `${path}sub/op/schedule/${id}`,
    method: 'put',
  })
}
/**
 * 退款列表
 */
export function getRefundOrderPage(data) {
  return request({
    url: `${path}refund/paginate`,
    method: 'get',
    params: { ...data },
  })
}
/**
 * 退款审批通过
 */
export function approveRefundOrder(data) {
  return request({
    url: `${path}refund/audit/approve`,
    method: 'put',
    data: data
  })
}
/**
 * 退款审批通过
 */
export function refuseRefundOrder(data) {
  return request({
    url: `${path}refund/audit/refuse`,
    method: 'put',
    data: data
  })
}