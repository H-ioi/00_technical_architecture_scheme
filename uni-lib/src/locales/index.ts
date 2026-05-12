/**
 * 国际化模块：
 * - `create-i18n.ts` — {@link createUniLibI18n}、全局单例、{@link uniLibTranslate}
 * - `use-uni-i18n.ts` — {@link useUniI18n}（`package.json` 子路径 `locales/i18n` 的类型亦指向此文件）
 */
import { enMessagesNested } from './lang/en'
import { zhCNMessagesNested } from './lang/zh-CN'

export * from './create-i18n'
export * from './merge-deep'
export * from './use-uni-i18n'
export const uniLibMessagesNested = {
  'zh-CN': zhCNMessagesNested,
  en: enMessagesNested
} as const

export type { UniLibEnMessagesNested, UniLibZhCNMessagesNested } from '@/types/i18n-messages'
