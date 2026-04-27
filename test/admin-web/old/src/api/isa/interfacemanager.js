import request from '@/router/axios'
const path = '/isadatacenter/interfacemanager'
/**
 * 接口文件-分页
 */
export function getInterfaceFilePage(query) {
  return request({
    url: `${path}/interfaceFile/paginate`,
    method: 'get',
    params: query
  })
}
/**
 * 已订阅接口-分页
 */
export function getInterfaceSubPage(query) {
  return request({
    url: `${path}/interfaceSub/paginate`,
    method: 'get',
    params: query
  })
}
/**
 * 接口文件-编辑查看
 */
export function getInterfaceFileDetail(id) {
  return request({
    url: `${path}/interfaceFile/get/${id}`,
    method: 'get',
  })
}
/**
 * 接口订阅-编辑查看
 */
export function getInterfaceSubDetail(id) {
  return request({
    url: `${path}/interfaceSub/get/${id}`,
    method: 'get',
  })
}
/**
 * 接口文件-新增
 */
export function addInterfaceFile(data) {
  return request({
    url: `${path}/interfaceFile/add`,
    method: 'post',
    data: data
  })
}
/**
 * 接口文件-编辑
 */
export function editInterfaceFile(data) {
  return request({
    url: `${path}/interfaceFile/edit`,
    method: 'post',
    data: data
  })
}
/**
 * 接口订阅-新增
 */
export function addInterfaceSub(data) {
  return request({
    url: `${path}/interfaceSub/add`,
    method: 'post',
    data: data
  })
}
/**
 * 接口订阅-编辑
 */
export function editInterfaceSub(data) {
  return request({
    url: `${path}/interfaceSub/edit`,
    method: 'post',
    data: data
  })
}
/**
 * 接口订阅-修改状态
 */
export function editInterfaceSubStatus(data) {
  return request({
    url: `${path}/interfaceSub/editStatus`,
    method: 'post',
    data: data
  })
}
/**
 * 接口文件-查询接口文件名是否已存在
 */
export function checkInterfaceFileName(data) {
  return request({
    url: `${path}/interfaceFile/checkInterfaceFileName`,
    method: 'post',
    data: data
  })
}
/**
 * 接口文件-查询已订阅是否已存在
 */
export function checkInterfaceSubName(data) {
  return request({
    url: `${path}/interfaceSub/checkInterfaceSubName`,
    method: 'post',
    data: data
  })
}
/**
 * 接口文件-删除
 */
export function delInterfaceFile(id) {
  return request({
    url: `${path}/interfaceFile/del?interfaceFileid=` + id,
    method: 'delete',
  })
}
/**
 * 接口订阅-删除
 */
export function delInterfaceSub(id) {
  return request({
    url: `${path}/interfaceSub/del?interfaceSubid=` + id,
    method: 'delete',
  })
}
export function checkFormFileName(value, type, form) {
  return new Promise(resolve => {
    let data = new FormData()
    data.append('interfaceFileName', value)
    if (type == 'edit') {
      data.append('interfaceFileid', form['id'])
    }
    checkInterfaceFileName(data).then(res => {
      console.log('checkInterfaceFileName', res);
      resolve(res.data.data)
    })
  })
}
export function checkSubName(value, type, form) {
  return new Promise(resolve => {
    let data = new FormData()
    data.append('InterfaceSubName', value)
    if (type == 'edit') {
      data.append('interfaceSubid', form['id'])
    }
    checkInterfaceSubName(data).then(res => {
      console.log('checkInterfaceSubName', res);
      resolve(res.data.data)
    })
  })
}
