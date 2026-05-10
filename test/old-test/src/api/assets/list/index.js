import request from '@/router/axios'
const path = "/workasset/asset"
/**
 * 获取资产一个层级的节点分页
 */
export function getAssetPage(data) {
  return request({
    url: `${path}/page`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 通过id查询资产
 */
export function getAssetDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: 'get',
  })
}
/**
 * 检验资产名称是否可用。true：是，false：否
 */
export function checkAssetcode(data) {
  return request({
    url: `${path}/check/code`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 检验资产名称是否可用。true：是，false：否
 */
export function checkAssetName(data) {
  return request({
    url: `${path}/check/name`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 删除
 */
export function delAsset(ids) {
  return request({
    url: `${path}/delete${ids}`,
    method: 'delete',
  })
}
/**
 * 新增资产
 */
export function saveAsset(data) {
  return request({
    url: `${path}/save`,
    method: 'post',
    data
  })
}
/**
 * 编辑资产
 */
export function editAsset(data) {
  return request({
    url: `${path}/update`,
    method: 'put',
    data
  })
}
/**
 * 修改资产状态
 */
export function changeAssetStatus(status, id) {
  return request({
    url: `${path}/status/${id}?status=${status}`,
    method: 'post',
  })
}
/**
 * 通过空间id查询资产
 */
export function getSpaceAssetList(data) {
  return request({
    url: `${path}/space/list`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 通过空间id查询资产
 */
export function getSpaceAssetUnbind(data) {
  return request({
    url: `${path}/space/unbinging/list`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 空间绑定资产
 */
export function bindSpaceAsset(data) {
  return request({
    url: `${path}/space/binging` + data,
    method: 'post',
  })
}
/**
 * 通过获取下一等级资产类型列表
 */
export function getAssetTypeList(data) {
  return request({
    url: `${path}/type/list`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 导入资产
 */
export function importAssetList(data) {
  return request({
    url: `${path}/import`,
    method: 'post',
    header: {
      headers: {
        "Content-Type": "application/x-download"
      }
    },
    responseType: "blob",
    data
  })
}
/**
 * 导出
 */
export function exportAssetList(data) {
  return request({
    url: `${path}/export`,
    method: 'get',
    params: {
      ...data
    },
    header: {
      headers: {
        "Content-Type": "application/x-download"
      }
    },
    responseType: "blob"
  })
}
/**
 * 下载模板
 */
export function downloadAsset(data) {
  return request({
    url: `${path}/download`,
    method: 'get',
    params: {
      ...data
    },
    header: {
      headers: {
        "Content-Type": "application/x-download"
      }
    },
    responseType: "blob"
  })
}
