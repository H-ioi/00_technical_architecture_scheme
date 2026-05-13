import type { UniOption } from 'uni-ui-lib'

import type { ProtocolRecord } from '@/types/modules/protocol'

export interface ProtocolFormProps {
  mode: 'add' | 'edit'
  source?: ProtocolRecord | null
  schoolOptions: UniOption[]
  protocolTypeOptions: UniOption[]
  moduleOptions: UniOption[]
  yesNoOptions: UniOption[]
  statusOptions: UniOption[]
}

export type ProtocolFormEmits = {
  saved: []
}
