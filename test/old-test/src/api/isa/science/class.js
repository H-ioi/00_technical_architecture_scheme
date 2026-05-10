import request from '@/router/axios'
const path = '/isadatacenter/bordacademicdata'
/**
 * 班级看板-MB分页
 */

export function getClassMbList(data) {
  return request({
    url: `${path}/paginateMBCLASSTable`,
    method: 'get',
    params: data
  })
}
/**
 * 班级看板-CAT4表
 */

export function getClassCAT4List(data) {
  return request({
    url: `${path}/paginateCAT4Table`,
    method: 'get',
    params: data
  })
}
/**
 * 班级看板-PASS表
 */

export function getClassPassList(data) {
  return request({
    url: `${path}/paginatePASSCLASSTable`,
    method: 'get',
    params: data
  })
}

/**
 * 班级看板-Progress表
 */
export function getClassProgressList(data) {
  return request({
    url: `${path}/paginatePROGRESSTable`,
    method: 'get',
    params: data
  })
}
/**
 * 班级看板-综合表表
 */
export function getCombineCLASSTable(data) {
  return request({
    url: `${path}/paginateCombineCLASSTable`,
    method: 'get',
    params: data
  })
}
/**
 * 班级看板--导出
 */
export function exportCombineCLASSTable(query) {
  return request({
    url: `${path}/paginateCombineCLASSTableExport`,
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





