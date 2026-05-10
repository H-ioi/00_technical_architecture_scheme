import type { UniOption } from 'uni-ui-lib'

import type { ProtocolRecord } from '@/types/modules/protocol'

export interface ProtocolDetailDialogProps {
  visible: boolean
  source?: ProtocolRecord | null
  schoolOptions: UniOption[]
  valueEnums: Record<string, UniOption[]>
}

export type ProtocolDetailDialogEmits = {
  'update:visible': [visible: boolean]
}
