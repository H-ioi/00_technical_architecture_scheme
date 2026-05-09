import { UNI_DEFAULT_LOCALE, type UniAppLocale } from 'uni-ui-lib'

// localStorage 键命名空间，避免同域下与其它应用冲突。
export const STORAGE_PREFIX = 'admin-web'

// 首次进入或未写入 storage 时的界面语言（与 uni-ui-lib 约定一致）。
export const DEFAULT_LOCALE: UniAppLocale = UNI_DEFAULT_LOCALE

// 主题初始化（与 uni-ui theme 配置一致）。
export const DEFAULT_THEME = {
  primaryColor: '#BA8E62'
} as const
