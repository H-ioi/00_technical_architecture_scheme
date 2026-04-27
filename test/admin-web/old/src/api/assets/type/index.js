import request from '@/router/axios'
const path = "/workasset/asset/type"
/**
 * 资产类型顶级目录
 */
export function getAssetTypeTop() {
  return request({
    url: `${path}/top`,
    method: 'get',
  })
}
/**
 * 资产类型树
 */
export function getAssetTypeTree(data) {
  return request({
    url: `${path}/tree`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 检验同个学校下资产类型编码是否可用。true：是，false：否
 */
export function getAssetTypeCheck(data) {
  return request({
    url: `${path}/check/code`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 资产类型分页大类
 */
export function getAssetTypeLarge(data) {
  return request({
    url: `${path}/page/large`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 资产类型分页中类
 */
export function getAssetTypeMiddle(data) {
  return request({
    url: `${path}/page/middle`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 资产类型分页小类
 */
export function getAssetTypeSmall(data) {
  return request({
    url: `${path}/page/small`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 资产类型列表
 */
export function getAssetTypeList(id) {
  return request({
    url: `${path}/list/${id}`,
    method: 'get',
  })
}
/**
 * 新增资产类型
 */
export function addAssetType(data) {
  return request({
    url: `${path}/save`,
    method: 'post',
    data
  })
}
/**
 * 编辑资产类型
 */
export function editAssetType(data) {
  return request({
    url: `${path}/update`,
    method: 'put',
    data
  })
}
/**
 * 通过id查询资产类型
 */
export function getAssetTypeDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: 'get',
  })
}
/**
 * 删除
 */
export function delAssetType(id) {
  return request({
    url: `${path}/${id}`,
    method: 'delete',
  })
}
/**
 * 禁用
 */
export function disableAssetType(id) {
  return request({
    url: `${path}/disable/${id}`,
    method: 'post',
  })
}
/**
 * 启用
 */
export function enableAssetType(id) {
  return request({
    url: `${path}/enable/${id}`,
    method: 'post',
  })
}
/**
 * 保存
 */
export function saveAssetTypeConf(data) {
  return request({
    url: `${path}/conf/save`,
    method: 'post',
    data
  })
}
/**
 * 查询
 */
export function getAssetTypeConf(data) {
  return request({
    url: `${path}/conf/get`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 获取下一级未绑定的此战类型
 */

export function getAssetTypeunbind(data) {
  return request({
    url: `${path}/unbinding/list`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 通过空间id获取对等学校数据字典值的顶级资产类型
 */

export function getSpaceTop(data) {
  return request({
    url: `${path}/get/by/space`,
    method: 'get',
    params: {
      ...data
    },
  })
}
