import type { AppLocale } from '@/types/i18n'

// localStorage 键命名空间，避免同域下与其它应用冲突。
export const STORAGE_PREFIX = 'admin-web'

// 首次进入或未写入 storage 时的界面语言。
export const DEFAULT_LOCALE: AppLocale = 'zh-CN'

// 主题初始化（与 uni-ui theme 配置一致）。
export const DEFAULT_THEME = {
  primaryColor: '#BA8E62'
} as const

