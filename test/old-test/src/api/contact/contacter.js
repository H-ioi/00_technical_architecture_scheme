import request from '@/router/axios'
/**
 * 联系人列表
 */
export function fetchContacterList(query) {
  return request({
    url: '/contact/contacter/paginate/own',
    method: 'get',
    params: query
  })
}
export function fetchContacterListWare(query) {
  return request({
    url: '/contact/contacter/paginate/ware',
    method: 'get',
    params: query
  })
}
/**
 * 批量联系人
 */
export function fetchContacterArr(query) {
  return request({
    url: '/contact/contacter/get/ids',
    method: 'get',
    params: query
  })
}
/**
 * 新增联系人
 */
export function addObj(obj) {
  return request({
    url: '/contact/contacter/add',
    method: 'post',
    data: obj
  })
}
/**
 * 导出联系人
 */
export function getExport(query) {
  return request({
    url: '/contact/contacter/export',
    method: 'get',
    params: query,
    header: {
      headers: {
        "Content-Type": "application/x-download"
      }
    },
    responseType: "blob"
  })
}
/**
 * 下载联系人模板
 */
export function getDownload() {
  return request({
    url: '/contact/contacter/download',
    method: 'get',
    header: {
      headers: {
        "Content-Type": "application/x-download"
      }
    },
    responseType: "blob"
  })
}
/**
 * 导入联系人模板
 */
export function postImport(obj) {
  return request({
    url: '/contact/contacter/import',
    method: 'post',
    data: obj

  })
}
/**
 * 删除联系人
 */
export function delObj(id) {
  return request({
    url: '/contact/contacter/del/' + id,
    method: 'delete'
  })
}
/**
 * 联系人关联客户
 */
export function fetContacterClient(id) {
  return request({
    url: '/contact/client/get/contacter/' + id,
    method: 'get',
  })
}
/**
 * 客户关联联系人
 */
export function fetClientContacter(id) {
  return request({
    url: '/contact/contacter/get/client/' + id,
    method: 'get',
  })
}
/**
 * 联系人详情
 */
export function fetDetail(id) {
  return request({
    url: '/contact/contacter/get/' + id,
    method: 'get',
  })
}
/**
 * 编辑联系人
 */
export function putContacter(obj) {
  return request({
    url: '/contact/contacter/edit',
    method: 'put',
    data: obj
  })
}
/**
 * 启用联系人
 */
export function enableContacter(id) {
  return request({
    url: '/contact/contacter/enable/' + id,
    method: 'put',
  })
}
/**
 * 禁用联系人
 */
export function disableContacter(id) {
  return request({
    url: '/contact/contacter/disable/' + id,
    method: 'put',
  })
}

/**
 * 客户设置标签
 */
export function playTags(obj, id) {
  return request({
    url: '/contact/contacter/tag/' + id,
    method: 'post',
    data: obj
  })
}
export function getContacterOpportunity(query) {
  return request({
    url: '/opportunity/opportunity/getByContacterId',
    method: 'get',
    params: query
  })
}
export function getContacterContract(id) {
  return request({
    url: '/contract/contract/get/contacter/' + id,
    method: 'get',
  })
}
export function getContacterClue(query) {
  return request({
    url: '/clue/clue/getByContacterId',
    method: 'get',
    params: query
  })
}
