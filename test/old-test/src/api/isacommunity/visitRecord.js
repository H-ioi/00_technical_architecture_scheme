import request from '@/router/newaxios/axios'
const path = '/isacommunity/clinic/visit/record'
const pendingPath = '/isacommunity/clinic/visit/pending-medication'

// ==================== 就诊记录 ====================

// 获取就诊记录分页列表
export function getVisitRecordPage(params) {
  return request({
    url: `${path}/paginate`,
    method: 'get',
    params: { ...params }
  })
}

// 获取就诊记录详情
export function getVisitRecordDetail(id) {
  return request({
    url: `${path}/get/${id}`,
    method: 'get'
  })
}

// 新增就诊记录
export function addVisitRecord(data) {
  return request({
    url: `${path}/add`,
    method: 'post',
    data
  })
}

// 更新就诊记录
export function editVisitRecord(data) {
  return request({
    url: `${path}/edit`,
    method: 'post',
    data
  })
}

// 删除就诊记录
export function delVisitRecord(ids) {
  return request({
    url: `${path}/del`,
    method: 'delete',
    params: { ids }
  })
}

// 导入就诊记录
export function importVisitRecord(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: `${path}/import`,
    method: 'post',
    data: formData,
    headers: {
      VERSION: 'B'
    }
  })
}

// 导出就诊记录
export function exportVisitRecord(params) {
  return request({
    url: `${path}/export`,
    method: 'get',
    params: { ...params },
    responseType: 'blob'
  })
}

// ==================== 待用药 ====================

// 获取待用药分页列表
export function getPendingMedicationPage(params) {
  return request({
    url: `${pendingPath}/paginate`,
    method: 'get',
    params: { ...params }
  })
}

// 获取待用药详情
export function getPendingMedicationDetail(id) {
  return request({
    url: `${pendingPath}/get/${id}`,
    method: 'get'
  })
}

// 操作待用药
export function operatePendingMedication(data) {
  return request({
    url: `${pendingPath}/operate`,
    method: 'post',
    data
  })
}

// 编辑待用药操作记录
export function editPendingMedicationOperation(data) {
  return request({
    url: `${pendingPath}/operation/edit`,
    method: 'post',
    data
  })
}

// 删除待用药
export function delPendingMedication(ids) {
  return request({
    url: `${pendingPath}/del`,
    method: 'delete',
    params: { ids }
  })
}

// 导出待用药
export function exportPendingMedication(params) {
  return request({
    url: `${pendingPath}/export`,
    method: 'get',
    params: { ...params },
    responseType: 'blob'
  })
}
