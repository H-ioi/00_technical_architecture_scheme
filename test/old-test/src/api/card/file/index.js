import request from '@/router/axios'
/**
 * 下载
 */
export function getCardFileDetail(id,data) {
    return request({
        url: '/card/web/public/file/download/' + id,
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
 * 上传
 */
export function uploadCardFile(data) {
    return request({
        url: '/card/web/public/file/upload',
        method: 'post',
        data: data
    })
}
/**
 * 批量上传
 */
export function uploadBatchCardFile(data) {
    return request({
        url: '/card/web/public/file/upload/batch',
        method: 'post',
        data: data
    })
}
/**
 * 批量获取
 */
export function getCarListInfo(data) {
    return request({
        url: '/card/web/public/file/info/ids',
        method: 'get',
        params: data
    })
}