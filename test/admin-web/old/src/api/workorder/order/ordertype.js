import request from '@/router/axios'
const path = "/workorder/order/type/config"
/**
 * 获取全部工单类型
 */
export function getOrderTypeList() {
    return request({
        url: `${path}/list/all`,
        method: 'get',
    })
}
/**
 * 获取关联校区工单类型
 */
export function getSchoolOrderType(schoolId) {
    return request({
        url: `${path}/list/by/school?school=` + schoolId,
        method: 'get',
    })
}
/**
 * 编辑关联校区工单类型
 */
export function editSchoolOrderType(data) {
    return request({
        url: `${path}/update`,
        method: 'put',
        data: data
    })
}