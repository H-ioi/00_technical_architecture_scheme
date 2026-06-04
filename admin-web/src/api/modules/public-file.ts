import { request } from 'uni-ui-lib'

const pub = '/publik'

export default {
  infoByIds: {
    name: '按 IDs 批量取文件信息',
    get: async (idsCsv: string) =>
      await request.get(`${pub}/file/info/ids`, { params: { ids: idsCsv } })
  },
  downloadBlob: {
    name: '下载文件',
    get: async (id: string | number) =>
      await request.get<Blob, Blob>(`${pub}/file/download/${id}`, { responseType: 'blob' })
  }
}
