import type { Recordable, UniFormConfig } from 'uni-ui-lib'

export interface MemberDetailProps {
  visible: boolean
  source?: Recordable | null
  config: UniFormConfig
}

export type MemberDetailEmits = {
  'update:visible': [visible: boolean]
}
