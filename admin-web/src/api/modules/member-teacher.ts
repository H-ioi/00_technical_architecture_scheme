import type { PageResult } from '@/types/api'
import type { SchoolOptionRecord, TeacherDetail, TeacherListParams, TeacherRecord } from '@/types/modules/member-teacher'
import { request } from '@/utils/request'

interface MembershipPageResult<T> {
  data: T[]
  total: number
  current: number
}

const MEMBERSHIP_PATH = '/isacommunity/membership'

const toPageParams = (params: TeacherListParams) => {
  const { pageNo, pageSize, ...rest } = params

  return {
    ...rest,
    current: params.current ?? pageNo,
    size: params.size ?? pageSize
  }
}

/** 分页查询教师列表。 */
export const fetchTeacherPage = async (
  params: TeacherListParams
): Promise<PageResult<TeacherRecord>> => {
  const result = await request.get<
    MembershipPageResult<TeacherRecord>,
    MembershipPageResult<TeacherRecord>
  >(`${MEMBERSHIP_PATH}/getTeacherPage`, {
    params: toPageParams(params)
  })

  return {
    records: result.data,
    total: result.total
  }
}

/** 查询教师详情。 */
export const fetchTeacherDetail = async (id: string | number): Promise<TeacherDetail> =>
  request
    .get<TeacherDetail, TeacherDetail>(`${MEMBERSHIP_PATH}/getTeacherDetail`, {
      params: { teacherId: id }
    })

/** 查询学校选项。 */
export const fetchTeacherSchoolOptions = async () => {
  const result = await request.get<SchoolOptionRecord[], SchoolOptionRecord[]>(
    `${MEMBERSHIP_PATH}/getSchoolList`
  )

  return result
}

/** 查询教师职位选项。 */
export const fetchTeacherRoleOptions = async () => {
  const result = await request.get<string[], string[]>(`${MEMBERSHIP_PATH}/getTeacherRoleList`)

  return result
}
