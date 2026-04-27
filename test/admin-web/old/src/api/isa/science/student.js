import request from '@/router/axios'
const path = '/isadatacenter/bordacademicdata'

/**
 * 爱莎数据平台学术看板管理-模糊查询学生
 */
export function searchStudentList(data) {
  return request({
    url: `${path}/searchList`,
    method: 'get',
    params: data
  })
}
/**
 * 爱莎数据平台学术看板管理-学年下拉框
 */
export function getAcademicYearList() {
  return request({
    url: `${path}/getAcademicYearList`,
    method: 'get',
  })
}
/**
 * 爱莎数据平台学术看板管理-班级下拉框
 */
export function getFormList() {
  return request({
    url: `${path}/getFormList`,
    method: 'get',
  })
}
/**
 * 爱莎数据平台学术看板管理-学期下拉框
 */
export function getTermList() {
  return request({
    url: `${path}/getTermList`,
    method: 'get',
  })
}
/**
 * 爱莎数据平台学术看板管理-年级下拉框
 */
export function getGradeList() {
  return request({
    url: `${path}/getYeargroupList`,
    method: 'get',
  })
}
/**
 * 爱莎数据平台学术看板管理-课程下拉框
 */
export function getSubjectList() {
  return request({
    url: `${path}/getSubjectList`,
    method: 'get',
  })
}

/**
* 爱莎数据平台学术看板管理-个人看板-查询列表
*/
export function getStudentInfo(data) {
  return request({
    url: `${path}/getStudentInfo`,
    method: 'get',
    params: data
  })
}
/**
* 爱莎数据平台学术看板管理-个人看板-CAT4柱状图
*/
export function getCAT4Bar(data) {
  return request({
    url: `${path}/listCAT4Bar`,
    method: 'get',
    params: data
  })
}
/**
* 爱莎数据平台学术看板管理-个人看板-PROGRESS柱状图
*/
export function getProgressBar(data) {
  return request({
    url: `${path}/listPROGRESSBar`,
    method: 'get',
    params: data
  })
}
/**
* 爱莎数据平台学术看板管理-个人看板-MB表
*/

export function getMBTable(data) {
  return request({
    url: `${path}/listMBTable`,
    method: 'get',
    params: data
  })
}
/**
* 爱莎数据平台学术看板管理-个人看板-pass表
*/
export function getPassTable(data) {
  return request({
    url: `${path}/listPASSTable`,
    method: 'get',
    params: data
  })
}


