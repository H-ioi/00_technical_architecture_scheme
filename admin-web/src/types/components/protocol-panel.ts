import type { UniOption } from 'uni-ui-lib'

import type { ProtocolRecord } from '@/types/modules/protocol'

export interface ProtocolPanelProps {
  visible: boolean
  source?: ProtocolRecord | null
  schoolOptions: UniOption[]
  valueEnums: Record<string, UniOption[]>
}

export type ProtocolPanelEmits = {
  'update:visible': [visible: boolean]
}
