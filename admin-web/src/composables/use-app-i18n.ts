import { useI18n } from 'vue-i18n'

import type { UniAppLocale } from 'uni-ui-lib'

export const useAppI18n = () => {
  const {
    locale,
    t: translate,
    te
  } = useI18n<{ message: unknown }, UniAppLocale>({
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
