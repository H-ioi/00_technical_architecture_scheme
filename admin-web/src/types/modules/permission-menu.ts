/** 租户菜单树节点（对齐 `/upms/menu/tenant/get` 返回）。 */
export interface PermissionMenuNode {
  id?: string | number
  menuId?: string | number
  parentId?: string | number
  name?: string
  path?: string
  icon?: string
  permission?: string
  sort?: number
  type?: string
  keepAlive?: string
  /** 后端可能命名为 hasChildren / hasChildrens，列表 tree-props 与之一致即可 */
  children?: PermissionMenuNode[]
}
