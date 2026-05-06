import { createI18n } from 'vue-i18n'

import en from './lang/en'
import zhCN from './lang/zh-CN'
import type { AppLocale, LocaleMessageSchema } from '@/types/i18n'
import { getAppTitle } from '@/utils'

export type { AppLocale, LocaleMessageSchema } from '@/types/i18n'

export const defaultLocale: AppLocale = 'zh-CN'

export const messages = {
  'zh-CN': zhCN,
  en
}

export const i18n = createI18n<[LocaleMessageSchema], AppLocale>({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages,
  missingWarn: false,
  fallbackWarn: false
})

export const setI18nLocale = (locale: AppLocale) => {
  i18n.global.locale.value = locale
  document.documentElement.lang = locale
}

export const translateAppMessage = (key?: string, fallback?: string) => {
  if (!key) {
    return fallback ?? ''
  }

  const translated = i18n.global.t(key)

  return translated === key ? (fallback ?? key) : translated
}

export const getLocalizedDocumentTitle = (titleKey?: string, fallbackTitle?: string) => {
  const routeTitle = translateAppMessage(titleKey, fallbackTitle)
  const appTitle = translateAppMessage('app.title', getAppTitle())

  return routeTitle ? `${routeTitle} - ${appTitle}` : appTitle
}
