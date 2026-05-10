import { createUniLibI18n } from 'uni-ui-lib'

import en from './lang/en'
import zhCN from './lang/zh-CN'

export const i18n = createUniLibI18n({
  name: 'uni-admin-web',
  hostMessages: {
    'zh-CN': zhCN as unknown as Record<string, unknown>,
    en: en as unknown as Record<string, unknown>
  }
})
