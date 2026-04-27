import request from '@/router/axios'
const order = "/workorder"
// 删除文件
export const deleteFile = params => request.get(`${order}/public/file/delete`, { params })
export function downloadFile(id, data) {
    console.log("id, data", id, data);
    return request({
        url: `${order}/public/file/download/${id}`,
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
// 上传文件
export const uploadFile = data => request.post(`${order}/public/file/upload`, data)
// 批量上传文件
export const uploadFiles = data => request.post(`${order}/public/file/upload/batch`, data)
