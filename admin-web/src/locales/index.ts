import { createUniLibI18n } from 'uni-ui-lib'

import en from './lang/en'
import zhCN from './lang/zh-CN'

/** 默认界面语言由 uni-lib {@link createUniLibI18n} 内 {@link UNI_DEFAULT_LOCALE} 决定 */
export const i18n = createUniLibI18n({
  hostMessages: {
    'zh-CN': zhCN as unknown as Record<string, unknown>,
    en: en as unknown as Record<string, unknown>
  }
})
