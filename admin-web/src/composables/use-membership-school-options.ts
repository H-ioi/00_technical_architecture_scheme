import type { UniOption } from 'uni-ui-lib'
import { toUniOptions, useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import { membershipApi } from '@/api'

/** 会员学校下拉：加载列表，并提供 id 列表转展示文案 */
export function useMembershipSchoolOptions() {
  const { locale } = useUniI18n()
  const schoolOptions = ref<UniOption[]>([])

  const loadSchoolOptions = async () => {
    const raw = await membershipApi.school.get()
    const list = Array.isArray(raw) ? raw : []
    schoolOptions.value = toUniOptions(list as Record<string, unknown>[], {
      labelKeys:
        locale.value === 'en' ? ['enName', 'name', 'cnName'] : ['cnName', 'name', 'enName'],
      valueKey: 'id'
    })
  }

  const schoolLabelById = computed(() => {
    const map = new Map<string, string>()
    for (const o of schoolOptions.value) {
      map.set(String(o.value), String(o.label))
    }
    return map
  })

  /** 学校 id（数组或逗号串）→ 分号分隔的展示名 */
  const formatSchoolIdsCsv = (raw: unknown): string => {
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
    const map = schoolLabelById.value
    const parts = ids.map((id) => map.get(id) ?? id)
    return parts.length ? parts.join('; ') : '—'
  }

  return { schoolOptions, loadSchoolOptions, formatSchoolIdsCsv }
}
