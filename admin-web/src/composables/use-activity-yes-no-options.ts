import type { UniOption } from 'uni-ui-lib'
import { useUniI18n } from 'uni-ui-lib'
import { computed } from 'vue'

import type { Translate } from '@/types/i18n'

/** 活动模块通用是/否下拉选项 */
export function useActivityYesNoOptions() {
  const { t } = useUniI18n()
  const tr = t as Translate

  return computed<UniOption[]>(() => [
    { label: tr('activity.yes'), value: '1' },
    { label: tr('activity.no'), value: '0' }
  ])
}
