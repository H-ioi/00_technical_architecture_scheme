import type { Recordable } from 'uni-ui-lib'

export interface CustomerRecord extends Recordable {
  id: number
  customerNo: string
  name: string
  level: 'vip' | 'normal' | 'trial'
  owner: string
  status: 0 | 1
  contractAmount: number
  progress: number
  tags: string[]
  createdAt: string
  lastFollowAt: string
  remark: string
}

export interface DepartmentRecord extends Recordable {
  id: number
  name: string
  manager: string
  memberCount: number
  status: 0 | 1
  createdAt: string
  children?: DepartmentRecord[]
}

export interface CustomerListParams extends Recordable {
  pageNo: number
  pageSize: number
  keyword?: string
  level?: CustomerRecord['level'] | ''
  status?: 0 | 1 | string
}

export interface PageResult<T extends Recordable = Recordable> {
  records: T[]
  total: number
}
