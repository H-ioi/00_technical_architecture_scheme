import { request } from 'uni-ui-lib'

import type { SchoolOptionRecord } from '@/types/modules/membership'

const base = '/isacommunity/buscommon'
const contentCommonBase = '/isacommunity/content/common'

/** 内容域校区下拉（旧 `getContentSchoolList` → `getNewSchoolList`）。 */
export default {
  schoolList: {
    url: `${base}/getNewSchoolList`,
    name: '内容校区列表',
    get: async function (this: { url: string }) {
      return await request.get<SchoolOptionRecord[], SchoolOptionRecord[]>(this.url)
    }
  },

  momentTypeList: {
    url: `${contentCommonBase}/momentTypeList`,
    name: '校园动态类型列表',
    get: async function (this: { url: string }) {
      return await request.get(this.url)
    }
  }
}
