import { API_PATHS } from '@/api/constants'
import { request } from 'uni-ui-lib'

const pub = API_PATHS.publik

/** 活动问卷绑定动态模板所用 scene */
export const ISA_COMMUNITY_QUESTIONNAIRE_SCENE = 'isa_community_questionnaire'

export default {
  templateAdd: {
    name: '新增动态表单模板',
    post: async (body: Record<string, unknown>) =>
      await request.post(`${pub}/template/dynamic/form/add`, body)
  },
  templateEdit: {
    name: '编辑动态表单模板',
    post: async (body: Record<string, unknown>) =>
      await request.post(`${pub}/template/dynamic/form/edit`, body)
  },
  templateDetail: {
    name: '动态表单模板详情',
    get: async (id: string | number) => await request.get(`${pub}/template/dynamic/form/get/${id}`)
  },
  bindOuterId: {
    name: '模板绑定业务 outerId',
    post: async (templateFormId: string | number, outerId: string | number, scene: string) => {
      const fd = new FormData()
      fd.append('ids', String(templateFormId))
      fd.append('outerId', String(outerId))
      fd.append('scene', scene)
      return await request.post(`${pub}/template/dynamic/form/update/outerId`, fd)
    }
  },
  listByOuterId: {
    name: '按 outerId 查模板列表',
    get: async (params: { outerId: string | number; scene: string }) =>
      await request.get(`${pub}/template/dynamic/form/get/outerId`, { params })
  },
  paginateIsaCommunity: {
    name: '问卷作答分页',
    post: async (body: Record<string, unknown>) =>
      await request.post(`${pub}/dynamic/form/template/paginateIsaCommunityCollection`, body)
  }
}
