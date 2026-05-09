import { API_PATHS } from '@/api/constants'
import type { PageResult } from '@/types/api'
import type { StudentListParams, StudentRecord } from '@/types/modules/member-student'
import { request } from 'uni-ui-lib'

// 分页查询学生列表。
export const fetchStudentPage = (params: StudentListParams) =>
  request.get<PageResult<StudentRecord>, PageResult<StudentRecord>>(`${API_PATHS.membership}/getStudentPage`, {
    params
  })

// 查询年级选项。
export const fetchYearGroupOptions = () =>
  request.get<string[], string[]>(`${API_PATHS.membership}/getYeargroupList`)

// 查询班级选项。
export const fetchFormOptions = () =>
  request.get<string[], string[]>(`${API_PATHS.membership}/getFormList`)
