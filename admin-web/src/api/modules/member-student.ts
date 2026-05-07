import type { PageResult } from '@/types/api'
import type { StudentListParams, StudentRecord } from '@/types/modules/member-student'
import type { SchoolOptionRecord } from '@/types/modules/member-teacher'
import { request } from '@/utils/request'

interface MembershipPageResult<T> {
  data: T[]
  total: number
  current: number
}

const MEMBERSHIP_PATH = '/isacommunity/membership'

const toPageParams = (params: StudentListParams) => {
  const { pageNo, pageSize, ...rest } = params

  return {
    ...rest,
    current: params.current ?? pageNo,
    size: params.size ?? pageSize
  }
}

/** 分页查询学生列表。 */
export const fetchStudentPage = async (
  params: StudentListParams
): Promise<PageResult<StudentRecord>> => {
  const result = await request.get<
    MembershipPageResult<StudentRecord>,
    MembershipPageResult<StudentRecord>
  >(`${MEMBERSHIP_PATH}/getStudentPage`, {
    params: toPageParams(params)
  })

  return {
    records: result.data,
    total: result.total
  }
}

/** 查询校区选项。 */
export const fetchMembershipSchoolOptions = async () => {
  const result = await request.get<SchoolOptionRecord[], SchoolOptionRecord[]>(
    `${MEMBERSHIP_PATH}/getSchoolList`
  )

  return result
}

/** 查询年级选项。 */
export const fetchYearGroupOptions = async () => {
  const result = await request.get<string[], string[]>(`${MEMBERSHIP_PATH}/getYeargroupList`)

  return result
}

/** 查询班级选项。 */
export const fetchFormOptions = async () => {
  const result = await request.get<string[], string[]>(`${MEMBERSHIP_PATH}/getFormList`)

  return result
}
