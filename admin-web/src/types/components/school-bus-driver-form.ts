import type { UniOption } from 'uni-ui-lib'

import type { DriverRecord } from '@/types/modules/school-bus-driver'

export interface SchoolBusDriverFormProps {
  visible: boolean
  mode: 'add' | 'edit'
  source?: DriverRecord | null
  schoolOptions: UniOption[]
  statusOptions: UniOption[]
}

export type SchoolBusDriverFormEmits = {
  'update:visible': [visible: boolean]
  saved: []
}
