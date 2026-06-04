import type { SchoolOptionRecord } from '@/types/modules/membership'
import { request } from 'uni-ui-lib'

const membershipBase = '/isacommunity/membership'

export default {
  school: {
    url: `${membershipBase}/getSchoolList`,
    name: '学校列表',
    get: async function (this: { url: string }) {
      return await request.get<SchoolOptionRecord[], SchoolOptionRecord[]>(this.url)
    }
  },
  /** 模糊检索学生（旧请假 `searchStudentList`，`GET .../searchList?student=`）。 */
  searchStudent: {
    name: '检索学生',
    get: async (student: string) => {
      return await request.get(`${membershipBase}/searchList`, {
        params: { student }
      })
    }
  },
  /** 按学号取学生详情（旧请假 `getStudentInfo`）。 */
  studentInfo: {
    name: '学生详情',
    get: async (admissonNo: string) => {
      return await request.get(`${membershipBase}/getStudentInfo`, {
        params: { admissonNo }
      })
    }
  }
}
