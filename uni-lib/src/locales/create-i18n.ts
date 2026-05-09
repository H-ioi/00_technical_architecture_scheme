import type { I18n, I18nOptions } from 'vue-i18n'
import { createI18n } from 'vue-i18n'

import { setUniAppName, storage } from '@/plugins/storage'
import { UNI_DEFAULT_LOCALE, isUniAppLocale, type UniAppLocale } from '@/types/i18n'

import { enMessagesNested } from './lang/en'
import { zhCNMessagesNested } from './lang/zh-CN'
import { mergeDeep } from './merge-deep'

let uniLibI18nSingleton: I18n | null = null

/** 由 {@link createUniLibI18n} 调用；业务侧勿重复挂载多套 vue-i18n。 */
export const registerUniLibI18nInstance = (next: I18n) => {
  uniLibI18nSingleton = next
}

export const tryGetUniLibI18nInstance = (): I18n | null => uniLibI18nSingleton

/** 指令、工具函数等无法 `useI18n` 时使用；须已执行 `createUniLibI18n` + `app.use(i18n)`。
 * 自定义指令的生命周期（例如 mounted 里绑定的点击回调）
 * 纯工具函数（谁都可以调用，调用栈里不一定有当前组件）
 * Pinia action、独立脚本、定时器/全局回调里若没有用别的方式接入全局单例，就必须使用这个。
 */
export const uniLibTranslate = (key: string, params?: Record<string, unknown>): string => {
  const i18n = tryGetUniLibI18nInstance()
  if (!i18n) {
    return key
  }
  const tFn = i18n.global.t as (key: string, values?: Record<string, unknown>) => string
  return params !== undefined && Object.keys(params).length > 0 ? tFn(key, params) : tFn(key)
}

export interface CreateUniLibI18nOptions {
  /**
   * 项目名称：写入 `localStorage` 前设置键前缀，与 `UniLib` 的 `runtime.name` 一致。
   * 不传则沿用当前前缀（默认 `uni-lib`）。
   */
  name?: string
  locale?: UniAppLocale
  fallbackLocale?: UniAppLocale
  /** 宿主文案；与库文案深度合并，同 key 下宿主覆盖库。 */
  hostMessages?: Partial<Record<UniAppLocale, Record<string, unknown>>>
}

/**
 * 创建组件库与宿主共用的 vue-i18n 实例，并注册为全局单例。
 * 宿主在 Pinia / Router 就绪后执行 `app.use(i18n)`。
 *
 * 未传 `locale` 时会读 `storage.get('locale')`（须已设置正确的 `runtime.name` / `createUniLibI18n({ name })`）。
 */
export function createUniLibI18n(options: CreateUniLibI18nOptions = {}) {
  if (options.name) {
    setUniAppName(options.name)
  }

  const fromStorage = storage.get<string>('locale')
  const locale = options.locale ?? (fromStorage && isUniAppLocale(fromStorage) ? fromStorage : undefined) ?? UNI_DEFAULT_LOCALE
  const fallbackLocale = options.fallbackLocale ?? locale

  document.documentElement.lang = locale

  const messages = {
    'zh-CN': mergeDeep(zhCNMessagesNested as unknown as Record<string, unknown>, options.hostMessages?.['zh-CN'] ?? {}),
    en: mergeDeep(enMessagesNested as unknown as Record<string, unknown>, options.hostMessages?.en ?? {})
  }

  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale,
    messages,
    globalInjection: true,
    missingWarn: false,
    fallbackWarn: false
  } as unknown as I18nOptions)

  registerUniLibI18nInstance(i18n)

  return i18n
}
