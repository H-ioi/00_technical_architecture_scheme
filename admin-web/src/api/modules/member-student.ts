import type { PageResult } from '@/types/api'
import type {
  StudentCreateParams,
  StudentDetail,
  StudentExportParams,
  StudentListParams,
  StudentRecord,
  StudentUpdateParams
} from '@/types/modules/member-student'
import { request } from '@/utils/request'

/** 分页查询学生列表。 */
export const fetchStudentPage = async (
  params: StudentListParams
): Promise<PageResult<StudentRecord>> =>
  request.get<PageResult<StudentRecord>, PageResult<StudentRecord>>('/member/student/page', {
    params
  })

/** 查询学生详情。 */
export const fetchStudentDetail = async (id: string | number): Promise<StudentDetail> =>
  request.get<StudentDetail, StudentDetail>(`/member/student/${id}`)

/** 新增学生。 */
export const createStudent = async (data: StudentCreateParams) =>
  request.post<void, void>('/member/student', data)

/** 更新学生。 */
export const updateStudent = async (data: StudentUpdateParams) =>
  request.put<void, void>(`/member/student/${data.id}`, data)

/** 批量删除学生。 */
export const deleteStudents = async (ids: Array<string | number>) =>
  request.delete<void, void>('/member/student', { data: { ids } })

/** 批量启用学生。 */
export const enableStudents = async (ids: Array<string | number>) =>
  request.post<void, void>('/member/student/enable', { ids })

/** 批量禁用学生。 */
export const disableStudents = async (ids: Array<string | number>) =>
  request.post<void, void>('/member/student/disable', { ids })

/** 导入学生。 */
export const importStudents = async (data: FormData) =>
  request.post<void, void>('/member/student/import', data)

/** 导出学生。 */
export const exportStudents = async (params: StudentExportParams) =>
  request.get<Blob, Blob>('/member/student/export', { params, responseType: 'blob' })

/** 下载学生导入模板。 */
export const downloadStudentTemplate = async () =>
  request.get<Blob, Blob>('/member/student/template', { responseType: 'blob' })
