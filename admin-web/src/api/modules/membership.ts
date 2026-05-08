import { API_PATHS } from '@/api/constants'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { request } from '@/utils/request'

// 查询学校选项。
export const fetchSchoolOptions = () =>
  request.get<SchoolOptionRecord[], SchoolOptionRecord[]>(`${API_PATHS.membership}/getSchoolList`)
