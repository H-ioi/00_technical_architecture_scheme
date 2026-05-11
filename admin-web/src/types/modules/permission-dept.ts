/** 部门树节点（对齐 `/upms/dept/tree`）。 */
export interface PermissionDeptRecord {
  id?: string | number
  deptId?: string | number
  parentId?: string | number
  name?: string
  sort?: number | string
  children?: PermissionDeptRecord[]
}
