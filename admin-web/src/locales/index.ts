import { createI18n } from 'vue-i18n'
import { uniLibMessagesNested, type UniAppLocale } from 'uni-ui-lib'

import { DEFAULT_LOCALE } from '@/config'
import { getAppTitle } from '@/utils'

import en from './lang/en'
import zhCN from './lang/zh-CN'
import { mergeDeep } from './merge-deep'

/** 项目文案结构（由默认语言包推导，仅用于模板类型安全） */
export type LocaleMessageSchema = typeof zhCN

const zhCNMerged = mergeDeep(
  uniLibMessagesNested['zh-CN'] as unknown as Record<string, unknown>,
  zhCN as unknown as Record<string, unknown>
) as typeof zhCN

const enMerged = mergeDeep(
  uniLibMessagesNested.en as unknown as Record<string, unknown>,
  en as unknown as Record<string, unknown>
) as typeof zhCN

export const messages = {
  'zh-CN': zhCNMerged,
  en: enMerged
}

export const i18n = createI18n<[LocaleMessageSchema], UniAppLocale>({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages,
  missingWarn: false,
  fallbackWarn: false
})

export const setI18nLocale = (locale: UniAppLocale) => {
  i18n.global.locale.value = locale
  document.documentElement.lang = locale
}

export const translateAppMessage = (
  key?: string,
  fallback?: string,
  params?: Record<string, unknown>
) => {
  if (!key) {
    return fallback ?? ''
  }

  const translated =
    params !== undefined && Object.keys(params).length > 0
      ? i18n.global.t(key, params as Record<string, unknown> & object)
      : i18n.global.t(key)

  return translated === key ? (fallback ?? key) : translated
}

export const getLocalizedDocumentTitle = (titleKey?: string, fallbackTitle?: string) => {
  const routeTitle = translateAppMessage(titleKey, fallbackTitle)
  const appTitle = translateAppMessage('app.title', getAppTitle())

  return routeTitle ? `${routeTitle} - ${appTitle}` : appTitle
}
