/** 家长学生关联查询参数（旧 `parentstudent/lookupByPhone`）。 */
export interface ActivityParentStudentLookupParams {
  phone: string
}

/** 家长学生关联搜索模型。 */
export interface ActivityParentStudentSearchModel {
  phone: string
}

/** 家长信息；后端字段以旧接口返回为准。 */
export interface ActivityParentInfo extends Record<string, unknown> {
  phoneNumber?: string
  email?: string
  isIsaParent?: boolean | number | string
}

export type ActivityParentStudentRow = Record<string, unknown>

export type ActivityParentStudentActivityRow = Record<string, unknown>

export interface ActivityParentStudentLookupResult {
  parent: ActivityParentInfo
  students: ActivityParentStudentRow[]
  activities: ActivityParentStudentActivityRow[]
}
