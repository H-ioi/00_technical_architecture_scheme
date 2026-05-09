import { API_PATHS } from '@/api/constants'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { request } from 'uni-ui-lib'

export default {
  school: {
    url: `${API_PATHS.membership}/getSchoolList`,
    name: '学校列表',
    get: async function (this: { url: string }) {
      return await request.get<SchoolOptionRecord[], SchoolOptionRecord[]>(this.url)
    }
  }
}
