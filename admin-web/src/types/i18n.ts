import type zhCN from '@/locales/lang/zh-CN'

export const supportedLocales = ['zh-CN', 'en'] as const

export type AppLocale = (typeof supportedLocales)[number]

export type LocaleMessageSchema = typeof zhCN
