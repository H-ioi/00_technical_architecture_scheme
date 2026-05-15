import type { UniOption } from 'uni-ui-lib'
import { toUniOptions, useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import { membershipApi } from '@/api'

/** 问卷管理等页面共用的校区下拉与「schoolIds → 文案」解析。 */

export function useMembershipSchoolOptions() {
  const { locale } = useUniI18n()
  const schoolOptions = ref<UniOption[]>([])

  const loadSchoolOptions = async () => {
    const raw = await membershipApi.school.get()
    const list = Array.isArray(raw) ? raw : []

    schoolOptions.value = toUniOptions(list, {
      labelKeys:
        locale.value === 'en' ? ['enName', 'name', 'cnName'] : ['cnName', 'name', 'enName'],
      valueKey: 'id'
    })
  }

  const optionBySchoolId = computed(() => {
    const m = new Map<string, string>()
    for (const o of schoolOptions.value) {
      m.set(String(o.value), String(o.label))
    }
    return m
  })

  /** 旧问卷列表：`schoolIds` 为 id 数组，表格列展示各校名 CSV。 */

  const schoolIdsCsv = (raw: unknown): string => {
    let ids: string[] = []

    if (Array.isArray(raw)) {
      ids = raw.map(String)
    } else if (typeof raw === 'string' && raw.trim()) {
      ids = raw
        .split(/[,;\s]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    } else if (raw != null && raw !== '') {
      ids = [String(raw)]
    }

    if (!ids.length) {
      return '—'
    }

    const map = optionBySchoolId.value

    const parts = ids.map((id) => map.get(id) ?? id)

    return parts.length ? parts.join('; ') : '—'
  }

  const schoolSingleLabel = (id: unknown): string => {
    if (id == null || id === '') {
      return '—'
    }

    const map = optionBySchoolId.value

    const k = String(id)

    return map.get(k) ?? k
  }

  return { schoolOptions, loadSchoolOptions, schoolIdsCsv, schoolSingleLabel }
}
