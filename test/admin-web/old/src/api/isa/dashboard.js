import request from '@/router/axios'
const path = '/isadatacenter/boardStatData'

/**
 * 统计看板--获取在读学生国籍统计
 */
export function getStudentCountryCounts(query) {
  return request({
    url: `${path}/getStudentCountryCounts`,
    method: 'get',
    params: query
  })
}
/**
 * 统计看板--在读学生当前学年各年级学生数量
 */
export function getStudentCurrentCounts(query) {
  return request({
    url: `${path}/getStudentCurrentCounts`,
    method: 'get',
    params: query
  })
}
/**
 * 统计看板--获取当前学年住宿学生年级数量统计
 */
export function getStudentDorCounts(query) {
  return request({
    url: `${path}/getStudentDorCounts`,
    method: 'get',
    params: query
  })
}
/**
 * 统计看板--获取每年入读学生数量统计
 */
export function getStudentEntryYearCounts(query) {
  return request({
    url: `${path}/getStudentEntryYearCounts`,
    method: 'get',
    params: query
  })
}
/**
 * 统计看板--获取学生性别统计
 */
export function getStudentGenderCounts(query) {
  return request({
    url: `${path}/getStudentGenderCounts`,
    method: 'get',
    params: query
  })
}
/**
 * 统计看板--获取学校学部列表
 */
export function getDivisionNameList(query) {
  return request({
    url: `${path}/getDivisionNameList`,
    method: 'get',
    params: query
  })
}
/**
 * 统计看板--在读学生当前学年各年级学生数量-导出
 */
export function stuCurrentCountsExport(query) {
  return request({
    url: `${path}/stuCurrentCountsExport`,
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
 * 统计看板--在读学生国籍分布-导出
 */
export function stuCountryCountsExport(query) {
  return request({
    url: `${path}/stuCountryCountsExport`,
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
 * 统计看板--当前学年住宿学生年级数量-导出
 */
export function stuDorCountsExport(query) {
  return request({
    url: `${path}/stuDorCountsExport`,
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
 * 统计看板--每年入读学生数量-导出
 */
export function stuEntryYearCountsExport(query) {
  return request({
    url: `${path}/stuEntryYearCountsExport`,
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
 * 统计看板--在读学生性别-导出
 */
export function stuGenderCountsExport(query) {
  return request({
    url: `${path}/stuGenderCountsExport`,
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


