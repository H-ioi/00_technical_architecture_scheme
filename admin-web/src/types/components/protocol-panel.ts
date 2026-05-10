import type { UniOption } from 'uni-ui-lib'

import type { ProtocolRecord } from '@/types/modules/protocol'

export interface ProtocolPanelProps {
  visible: boolean
  source?: ProtocolRecord | null
  schoolOptions: UniOption[]
  /** 协议类型 / 模块 / 是否签署 / 状态 等字段的选项映射（详情文案用） */
  enumOptionMaps: Record<string, UniOption[]>
}

export type ProtocolPanelEmits = {
  'update:visible': [visible: boolean]
}
