import request from '@/router/axios'
/**
 * 获取机构人员列表
 */
export function getPersonList(data) {
    return request({
        url: '/card/organization/person/page',
        method: 'get',
        params: data
    })
}
/**
 * 查询人员
 */
export function getPersonDetail(id) {
    return request({
        url: '/card/organization/person/' + id,
        method: 'get',
    })
}
/**
 * 下载模板
 */
export function getPersonDownload() {
    return request({
        url: '/card/organization/person/download',
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
 * 导出
 */
export function exportPerson(data) {
    return request({
        url: '/card/organization/person/export',
        method: 'get',
        params: data,
        header: {
            headers: {
                "Content-Type": "application/x-download"
            }
        },
        responseType: "blob"
    })
}
/**
 * 导入机构人员
 */
export function importPerson(data) {
    return request({
        url: '/card/organization/person/import',
        method: 'post',
        data: data
    })
}
/**
 * 增加机构人员
 */
export function addPerson(data) {
    return request({
        url: '/card/organization/person',
        method: 'post',
        data: data
    })
}
/**
 * 编辑机构人员
 */
export function editPerson(data) {
    return request({
        url: '/card/organization/person',
        method: 'put',
        data: data
    })
}
/**
 * 删除机构人员
 */
export function delPerson(id) {
    return request({
        url: '/card/organization/person/' + id,
        method: 'delete',
    })
}