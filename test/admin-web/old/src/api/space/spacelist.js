import request from '@/router/axios'
const path = "/workspace"
/**
 * 获取空间一个层级的所有节点（pid参数为空获取顶级节点，不为空则获取当前pid下的所有子节点）
 */
export function getSpaceList(data) {
  return request({
    url: `${path}/space/list`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 获取空间一个层级的节点分页
 */
export function getSpacePage(data) {
  return request({
    url: `${path}/space/page`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 获取空间看板的节点分页
 */
 export function getSpacePageBoard(data) {
  return request({
    url: `${path}/space/page/board`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 禁用
 */
export function disableSpace(id) {
  return request({
    url: `${path}/space/disable/${id}`,
    method: 'post',
  })
}
/**
 * 启用
 */
export function enableSpace(id) {
  return request({
    url: `${path}/space/enable/${id}`,
    method: 'post',
  })
}
/**
 * 新增空间
 */
export function addSpace(data) {
  return request({
    url: `${path}/space/save`,
    method: 'post',
    data
  })
}
/**
 * 编辑空间
 */
export function editSpace(data) {
  return request({
    url: `${path}/space/update`,
    method: 'put',
    data
  })
}
/**
 * 查询绑定的动态表单数据
 */
export function getSpaceTypeForm(data) {
  return request({
    url: `${path}/space/type/get/form`,
    method: 'get',
    params: {
      ...data
    },
  })
}

/**
 * 查询空间
 */
export function getSpaceDetail(id) {
  return request({
    url: `${path}/space/get/${id}`,
    method: 'get',
  })
}
/**
 * 下载模板
 */
export function downloadSpaceTemplate(data) {
  return request({
    url: `${path}/space/download`,
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
 * 上传模板
 */
export function importSpaceTemplate(data) {
  return request({
    url: `${path}/space/import`,
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
 * 获取空间树
 */
 export function getSpaceTree(data) {
  return request({
    url: `${path}/space/tree`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 校验空间名称
 */
export function repeatSpaceName(data) {
  return request({
    url: `${path}/space/check/name`,
    method: 'get',
    params: {
      ...data
    },
  })
}
/**
 * 删除
 */
 export function delSpace(id) {
  return request({
    url: `${path}/space/${id}`,
    method: 'delete',
  })
}
