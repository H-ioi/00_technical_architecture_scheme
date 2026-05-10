import type { Recordable, UniFormConfig } from 'uni-ui-lib'

export interface MemberDetailDialogProps {
  visible: boolean
  source?: Recordable | null
  config: UniFormConfig
}

export type MemberDetailDialogEmits = {
  'update:visible': [visible: boolean]
}
