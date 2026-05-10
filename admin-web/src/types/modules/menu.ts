/** 后端菜单树节点（用户菜单接口原始结构）。 */
export interface BackendMenuRecord {
  path?: string
  url?: string
  name?: string
  label?: string
  title?: string
  icon?: string
  permission?: string | string[]
  permissions?: string | string[]
  authority?: string | string[]
  children?: BackendMenuRecord[]
}
