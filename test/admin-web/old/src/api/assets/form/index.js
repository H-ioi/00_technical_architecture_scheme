import request from '@/router/axios'
const path = "/workasset/asset/form"
/**
 * 查询资产动态表单模板
 */
export function getAssetForm(data) {
  return request({
    url: `${path}/get`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 初始化数据，第一次新增动态表单模板时调用
 */
export function saveAssetForm(data) {
  return request({
    url: `${path}/init${data}`,
    method: 'post',
  })
}
