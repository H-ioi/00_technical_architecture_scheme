import request from '@/router/axios'
const path = '/isadatacenter'
/**
 * 爱莎数据平台数据检索页-年级下拉框
 */
export function getYeargroupList() {
  return request({
    url: `${path}/dataretreval/getYeargroupList`,
    method: 'get',
  })
}
/**
 * 爱莎数据平台数据检索页-班级下拉框
 */
export function getFormList() {
  return request({
    url: `${path}/dataretreval/getFormList`,
    method: 'get',
  })
}
/**
 * 爱莎数据平台数据检索页-校区下拉框
 */
export function getSchoolList() {
  return request({
    url: `${path}/dataretreval/getSchoolList`,
    method: 'get',
  })
}
/**
 * 爱莎数据平台数据检索页-教师表分页
 */
export function getTeacherPage(query) {
  return request({
    url: `${path}/dataretreval/getTeacherPage`,
    method: 'get',
    params: query
  })
}
/**
 * 爱莎数据平台数据检索页-学生表分页
 */
export function getStudentPage(query) {
  return request({
    url: `${path}/dataretreval/getStudentPage`,
    method: 'get',
    params: query
  })
}
/**
 * 爱莎数据平台数据检索页-家长表分页
 */
export function getParentPage(query) {
  return request({
    url: `${path}/dataretreval/getParentPage`,
    method: 'get',
    params: query
  })
}
/**
 * 爱莎数据平台数据检索页-学生申请用药表分页
 */
export function getStuApply4MedicationPage(query) {
  return request({
    url: `${path}/businessDataretreval/getStuApply4MedicationPage`,
    method: 'get',
    params: query
  })
}
/**
 * 爱莎数据平台数据检索页-学生餐厅信息表分页
 */
export function getStuDinningInfoPage(query) {
  return request({
    url: `${path}/businessDataretreval/getStuDinningInfoPage`,
    method: 'get',
    params: query
  })
}
/**
 * 爱莎数据平台数据检索页-学生基础医疗数据表分页
 */
export function getStuMedicalBasicInfoPage(query) {
  return request({
    url: `${path}/businessDataretreval/getStuMedicalBasicInfoPage`,
    method: 'get',
    params: query
  })
}
/**
 * 爱莎数据平台数据检索页-学生医疗联系表分页
 */
export function getStuMedicalContactPage(query) {
  return request({
    url: `${path}/businessDataretreval/getStuMedicalContactPage`,
    method: 'get',
    params: query
  })
}
/**
 * 爱莎数据平台数据检索页-学生住宿信息表分页
 */
export function getStuStayPage(query) {
  return request({
    url: `${path}/businessDataretreval/getStuStayPage`,
    method: 'get',
    params: query
  })
}
/**
 * 爱莎数据平台数据检索页-教师学生关联表
 */
export function getTeacherDetail(id) {
  return request({
    url: `${path}/dataretreval/getTeacherDetail?teacherId=${id}`,
    method: 'get',
  })
}
/**
 * 爱莎数据中心首页-API接口
 */
export function getAPINum() {
  return request({
    url: `${path}/homepage/getAPINum`,
    method: 'get',
  })
}
/**
 * 爱莎数据中心首页-今日数据源变动
 */
export function getDataSoucesChange() {
  return request({
    url: `${path}/homepage/getDataSoucesChange`,
    method: 'get',
  })
}
/**
 * 爱莎数据中心首页-数据源总数
 */
export function getDataSourcesNum() {
  return request({
    url: `${path}/homepage/getDataSourcesNum`,
    method: 'get',
  })
}
/**
 * 爱莎数据中心首页-近五天登录情况
 */
export function getListLonginLog() {
  return request({
    url: `/upms/log/listLonginLog`,
    method: 'get',
  })
}
/**
 * 爱莎数据中心首页-角色类型统计
 */
export function getListRoleNames() {
  return request({
    url: `/upms/role/listRoleNames`,
    method: 'get',
  })
}
/**
 * 家长表-导出
 */
export function parentExport(data) {
  return request({
    url: `${path}/dataretreval/parentExport`,
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
 * 学生表-导出
 */
export function studentExport(data) {
  return request({
    url: `${path}/dataretreval/studentExport`,
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
 * 教师表-导出
 */
export function teacherExport(data) {
  return request({
    url: `${path}/dataretreval/teacherExport`,
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
 * 学生申请用药表-导出
 */
export function stuApply4MedicationExport(data) {
  return request({
    url: `${path}/businessDataretreval/stuApply4MedicationExport`,
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
 * 学生餐厅信息表-导出
 */
export function stuDinningInfoExport(data) {
  return request({
    url: `${path}/businessDataretreval/stuDinningInfoExport`,
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
 * 学生基础医疗数据表-导出
 */
export function stuMedicalBasicInfoExport(data) {
  return request({
    url: `${path}/businessDataretreval/stuMedicalBasicInfoExport`,
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
 * 学生医疗联系表-导出
 */
export function stuMedicalContactExport(data) {
  return request({
    url: `${path}/businessDataretreval/stuMedicalContactExport`,
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
 * 学生住宿信息表-导出
 */
export function stuStayExport(data) {
  return request({
    url: `${path}/businessDataretreval/stuStayExport`,
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