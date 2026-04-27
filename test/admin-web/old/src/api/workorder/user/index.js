import request from '@/router/axios'
const path = "/workorder"
/**
 * 获取用户工单列表
 */
export function getUserOrderList(data) {
    return request({
        url: `${path}/order/client/page`,
        method: 'get',
        params: { ...data },
    })
}
/**
 * 获取工单用户列表
 */
export function getOrderUserList(data) {
    return request({
        url: `${path}/order/user/paginate`,
        method: 'get',
        params: { ...data },
    })
}
/**
 * 获取工单用户详情
 */
export function getOrderUserDetail(id) {
    return request({
        url: `${path}/order/user/get/${id}`,
        method: 'get',
    })
}
/**
 * 启用
 */
export function enableOrderUser(id) {
    return request({
        url: `${path}/order/user/enable/${id}`,
        method: 'post',
    })
}
/**
 * 禁用
 */
export function disableOrderUser(id) {
    return request({
        url: `${path}/order/user/disable/${id}`,
        method: 'post',
    })
}
/**
 * 编辑工单用户
 */
export function editOrderUser(data) {
    return request({
        url: `${path}/order/user/edit`,
        method: 'post',
        data: data
    })
}
/**
 * 新增工单用户
 */
export function addOrderUser(data) {
    return request({
        url: `${path}/order/user/add`,
        method: 'post',
        data: data
    })
}

/**
 * 删除工单用户
 */
export function delOrderUser(data) {
    return request({
        url: `${path}/order/user/del`,
        method: 'delete',
        data: data
    })
}
/**
 * 导出工单用户
 */
export function exportOrderUser(data) {
    return request({
        url: `${path}/order/user/export`,
        method: 'get',
        params: { ...data },
        header: {
            headers: {
                "Content-Type": "application/x-download"
            }
        },
        responseType: "blob"
    })
}
/**
 * 导出工单用户
 */
export function downloadUserExcel() {
    return request({
        url: `${path}/order/user/download`,
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
 * 导入工单用户
 */
export function importOrderUser(data) {
    return request({
        url: `${path}/order/user/import`,
        method: 'post',
        data: data
    })
}


