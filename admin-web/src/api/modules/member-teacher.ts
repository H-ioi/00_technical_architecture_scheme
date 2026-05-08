import { API_PATHS } from '@/api/constants'
import type { PageResult } from '@/types/api'
import type { TeacherListParams, TeacherRecord } from '@/types/modules/member-teacher'
import { request } from '@/utils/request'

// 分页查询教师列表。
export const fetchTeacherPage = (params: TeacherListParams) =>
  request.get<PageResult<TeacherRecord>, PageResult<TeacherRecord>>(`${API_PATHS.membership}/getTeacherPage`, {
    params
  })

// 查询教师职位选项。
export const fetchTeacherRoleOptions = () =>
  request.get<string[], string[]>(`${API_PATHS.membership}/getTeacherRoleList`)
