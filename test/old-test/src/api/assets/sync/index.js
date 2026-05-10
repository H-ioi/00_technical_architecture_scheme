import request from '@/router/axios'
const path = "/workasset/asset/sync"
/**
 * 查询资产列表
 */
export function getAssetList(data) {
  return request({
    url: `${path}/paginate`,
    method: 'get',
    params: data,
  })
}
/**
 * 同步
 */
export function isSynchronization(id, data) {
  return request({
    url: `${path}/synchronize/confirm/${id}`,
    method: 'put',
    data
  })
}
/**
 * 不同步
 */
export function noSynchronization(id) {
  return request({
    url: `${path}/synchronize/cancel/${id}`,
    method: 'put',
  })
}
/**
 * 批量同步
 */
export function batchSynchronization(ids, data) {
  return request({
    url: `${path}/batch/synchronize/confirm?ids=${ids}`,
    method: 'put',
    data
  })
}
/**
 * 批量不同步
 */
export function batchNoSynchronization(id) {
  return request({
    url: `${path}/batch/synchronize/cancel?ids=${id}`,
    method: 'put',
  })
}
