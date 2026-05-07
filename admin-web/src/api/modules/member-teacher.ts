import type { PageResult } from '@/types/api'
import type {
  SchoolOptionRecord,
  TeacherCreateParams,
  TeacherDetail,
  TeacherExportParams,
  TeacherListParams,
  TeacherRecord,
  TeacherUpdateParams
} from '@/types/modules/member-teacher'
import { request } from '@/utils/request'

/** 分页查询教师列表。 */
export const fetchTeacherPage = async (
  params: TeacherListParams
): Promise<PageResult<TeacherRecord>> =>
  request.get<PageResult<TeacherRecord>, PageResult<TeacherRecord>>('/member/teacher/page', {
    params
  })

/** 查询教师详情。 */
export const fetchTeacherDetail = async (id: string | number): Promise<TeacherDetail> =>
  request.get<TeacherDetail, TeacherDetail>(`/member/teacher/${id}`)

/** 新增教师。 */
export const createTeacher = async (data: TeacherCreateParams) =>
  request.post<void, void>('/member/teacher', data)

/** 更新教师。 */
export const updateTeacher = async (data: TeacherUpdateParams) =>
  request.put<void, void>(`/member/teacher/${data.id}`, data)

/** 批量删除教师。 */
export const deleteTeachers = async (ids: Array<string | number>) =>
  request.delete<void, void>('/member/teacher', { data: { ids } })

/** 批量启用教师。 */
export const enableTeachers = async (ids: Array<string | number>) =>
  request.post<void, void>('/member/teacher/enable', { ids })

/** 批量禁用教师。 */
export const disableTeachers = async (ids: Array<string | number>) =>
  request.post<void, void>('/member/teacher/disable', { ids })

/** 导入教师。 */
export const importTeachers = async (data: FormData) =>
  request.post<void, void>('/member/teacher/import', data)

/** 导出教师。 */
export const exportTeachers = async (params: TeacherExportParams) =>
  request.get<Blob, Blob>('/member/teacher/export', { params, responseType: 'blob' })

/** 下载教师导入模板。 */
export const downloadTeacherTemplate = async () =>
  request.get<Blob, Blob>('/member/teacher/template', { responseType: 'blob' })

/** 查询学校选项。 */
export const fetchTeacherSchoolOptions = async () =>
  request.get<SchoolOptionRecord[], SchoolOptionRecord[]>('/schools/options')
