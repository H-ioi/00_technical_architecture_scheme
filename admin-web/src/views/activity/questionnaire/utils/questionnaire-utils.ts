/** 问卷模块：报名外链、列表/表单通用格式化与校区选项。 */

import type { UniOption } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { toUniOptions, useUniI18n } from 'uni-ui-lib'
import { computed, ref } from 'vue'

import { membershipApi } from '@/api'

// --- 家长端报名链接 ---

function stripSlash(s: string): string {
  return s.replace(/\/$/, '')
}

export function buildQuestionnaireSignupUrl(questionnaireId: string | number): string {
  const origin = stripSlash(String(import.meta.env.VITE_COMMUNITY_WEB_ORIGIN ?? ''))
  if (!origin) {
    return ''
  }

  return `${origin}/#/isacommunity/activity/questionnaire/signup?id=${encodeURIComponent(String(questionnaireId))}`
}

// --- 是/否、时间、校区下拉 ---

type Tr = (k: string) => string

/** 问卷页：是/否 下拉选项 */
export const yesNoOptions = (t: Tr): UniOption[] => [
  { label: t('activity.yes'), value: '1' },
  { label: t('activity.no'), value: '0' }
]

export const labelForValue = (opts: UniOption[], v: unknown) => {
  const s = v == null || v === '' ? '' : String(v)
  return opts.find((o) => String(o.value) === s)?.label ?? '—'
}

export const fmtTs = (v: unknown, empty = '—') => {
  if (v == null || v === '') {
    return empty
  }
  const d = dayjs(String(v))
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm') : String(v)
}

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
