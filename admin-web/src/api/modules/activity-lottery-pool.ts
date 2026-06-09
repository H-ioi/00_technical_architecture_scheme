import { request } from 'uni-ui-lib'

import { downloadBlob } from '@/utils/download'

const filePath = '/isacommunity/activity/lotteryPoolFile'
const listPath = '/isacommunity/activity/lotteryPoolList'

export default {
  listByProgram: {
    name: '按项目获取奖池文件',
    get: async (params: { programId: string | number }) =>
      await request.get(`${filePath}/listByProgram`, { params })
  },
  downloadTemplate: {
    name: '下载奖池导入模板',
    get: async (filename = 'lottery-pool-template.xlsx') => {
      const blob = await request.get<Blob, Blob>(`${filePath}/download`, {
        responseType: 'blob'
      })
      downloadBlob(blob, filename)
    }
  },
  importFile: {
    name: '导入奖池文件',
    post: async (data: FormData) => await request.post(`${filePath}/import`, data)
  },
  removeFile: {
    name: '删除奖池文件',
    post: async (id: string | number) => {
      const fd = new FormData()
      fd.append('id', String(id))
      await request.post(`${filePath}/del`, fd)
    }
  },
  memberPage: {
    name: '奖池名单分页',
    get: async (params: { poolId: string | number; current: number; size: number }) =>
      await request.get(`${listPath}/listByPool`, { params })
  }
}
