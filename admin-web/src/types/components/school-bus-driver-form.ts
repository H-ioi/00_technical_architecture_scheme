import type { UniOption } from 'uni-ui-lib'

import type { DriverRecord } from '@/types/modules/school-bus-driver'

export interface SchoolBusDriverFormProps {
  visible: boolean
  mode: 'add' | 'edit' | 'look'
  source?: DriverRecord | null
  /** 单校区场景默认勾选（与旧系统 `dictionary.school.length === 1` 一致） */
  defaultSchoolId?: string | number | null
  schoolOptions: UniOption[]
  statusOptions: UniOption[]
}

export type SchoolBusDriverFormEmits = {
  'update:visible': [visible: boolean]
  saved: []
}
