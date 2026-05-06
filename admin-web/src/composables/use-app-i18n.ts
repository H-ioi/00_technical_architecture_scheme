import { useI18n } from 'vue-i18n'

import type { AppLocale } from '@/types/i18n'

export const useAppI18n = () => {
  const {
    locale,
    t: translate,
    te
  } = useI18n<{ message: unknown }, AppLocale>({
    useScope: 'global'
  })
  const t = (key?: string, fallback?: string, params?: Record<string, unknown>) => {
    if (!key) {
      return fallback ?? ''
    }

    return te(key) ? translate(key, params ?? {}) : (fallback ?? key)
  }

  return {
    locale,
    t
  }
}
