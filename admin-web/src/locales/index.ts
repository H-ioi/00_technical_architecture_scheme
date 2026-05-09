import { createUniLibI18n } from 'uni-ui-lib'

import en from './lang/en'
import zhCN from './lang/zh-CN'

/** 项目文案结构（由默认语言包推导，仅用于模板类型安全） */
export type LocaleMessageSchema = typeof zhCN

/** 默认界面语言由 uni-lib {@link createUniLibI18n} 内 {@link UNI_DEFAULT_LOCALE} 决定 */
export const i18n = createUniLibI18n({
  hostMessages: {
    'zh-CN': zhCN as unknown as Record<string, unknown>,
    en: en as unknown as Record<string, unknown>
  }
})
