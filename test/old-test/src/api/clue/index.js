import request from '@/router/axios'
/**
 * 我的线索列表
 */
export function GetMyClueList(data) {
  return request({
    url: '/clue/clue/my/page',
    method: 'get',
    params: { ...data },
  })
}
/**
 * 获取线索库
 */
export function GetArchivesList(data) {
  return request({
    url: '/clue/clue/archives/page',
    method: 'get',
    params: { ...data },
  })
}
/**
 * 获取线索公海
 */
export function GetPoolList(data) {
  return request({
    url: '/clue/clue/pool/page',
    method: 'get',
    params: { ...data },
  })
}
/**
 * 查询线索
 */
export function GetCurrentClue(id) {
  return request({
    url: '/clue/clue/' + id,
    method: 'get',
  })
}
/**
 * 新增线索
 */
export function addClue(obj) {
  return request({
    url: '/clue/clue',
    method: 'post',
    data: obj
  })
}
/**
 * 编辑线索
 */
export function putClue(obj) {
  return request({
    url: '/clue/clue',
    method: 'put',
    data: obj
  })
}
/**
 * 删除线索
 */
export function deleteClue(id) {
  return request({
    url: '/clue/clue/' + id,
    method: 'delete',
  })
}


/**
 * 退回
 */
export function RebackClue(obj) {
  return request({
    url: '/clue/clue/reback',
    method: 'post',
    data: obj
  })
}
/**
 * 新增线索到公海
 */
export function savePoolClue(obj) {
  return request({
    url: '/clue/clue/savePool',
    method: 'post',
    data: obj
  })
}
/**
 * 转商机
 */
export function toOpportunity(obj, id) {
  return request({
    url: '/clue/clue/toOpportunity/' + id,
    method: 'post',
    data: obj
  })
}
/**
 * 线索列表筛选条件
 */
export function GetClueConditions() {
  return request({
    url: '/clue/clue/conditions',
    method: 'get',
  })
}
/**
 * 关闭线索
 */
export function CloseClue(obj) {
  return request({
    url: '/clue/clue/close',
    method: 'post',
    data: obj
  })
}
export function ClosePoolClue(obj) {
  return request({
    url: '/clue/clue/pool/close',
    method: 'post',
    data: obj
  })
}
/**
 * 线索分配
 */
export function assignClue(obj) {
  return request({
    url: '/clue/clue/assign/',
    method: 'post',
    data: obj
  })
}
/**
 * 线索认领
 */
export function claimClue(obj, id) {
  return request({
    url: '/clue/clue/claim/' + id,
    method: 'post',
    data: obj
  })
}
/**
 * 根据客户获取线索
 */
export function getByClientIdClue(obj) {
  return request({
    url: '/clue/clue/getByClientId',
    method: 'get',
    params: { ...obj },
  })
}
/**
 * 获取线索数量
 */
export function getCountClue() {
  return request({
    url: '/clue/clue/get/index/count',
    method: 'get',
  })
}


