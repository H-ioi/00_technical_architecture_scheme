/**
 * 首页域接口（标准案例）
 *
 * - 默认导出对象，键为业务能力名
 * - 每项含 url、name、get/post/put/delete 之一
 * - 方法内使用 function + this.url，便于复制 url
 * - 业务 data 由 @/utils/request 拦截器解包，此处直接 `res.data`
 */
import type { HomeConfigQuery, HomeConfigVO, HomeStatusVO } from '@/types/modules/home'
import http from '@/utils/request'

const baseUrl = '/demo/home'

export default {
  status: {
    url: `${baseUrl}/status`,
    name: '首页运行状态',
    get: async function (this: { url: string }): Promise<HomeStatusVO | undefined> {
      const res = await http.get<HomeStatusVO>(this.url, {
        headers: { hideLoad: true }
      })
      return res.data
    }
  },

  config: {
    url: `${baseUrl}/config`,
    name: '首页配置',
    get: async function (
      this: { url: string },
      params?: HomeConfigQuery
    ): Promise<HomeConfigVO | undefined> {
      const res = await http.get<HomeConfigVO>(this.url, {
        params: params ? { ...params } : undefined
      })
      return res.data
    }
  }
}
