/**
 * 组件库约定的界面语言，与内置文案键、Element Plus 语言包保持一致。
 * 模板项目应优先使用本模块类型，而非各自维护一份语言枚举。
 */
export const uniSupportedLocales = ["zh-CN", "en"] as const;

export type UniAppLocale = (typeof uniSupportedLocales)[number];

export const UNI_DEFAULT_LOCALE: UniAppLocale = "zh-CN";

export const isUniAppLocale = (value: string): value is UniAppLocale =>
  (uniSupportedLocales as readonly string[]).includes(value);

/** 指令、表格格式化等无法 `useI18n` 时的翻译函数形状 */
export type UniTranslate = (
  key: string,
  params?: Record<string, unknown>,
) => string;

export interface CreateUniLibI18nOptions {
  /**
   * 项目名称：写入 `localStorage` 前设置键前缀，与 `UniLib` 的 `runtime.name` 一致。
   * 不传则沿用当前前缀（默认 `uni-lib`）。
   */
  name?: string;
  locale?: UniAppLocale;
  fallbackLocale?: UniAppLocale;
  /** 宿主文案；与库文案深度合并，同 key 下宿主覆盖库。 */
  hostMessages?: Partial<Record<UniAppLocale, Record<string, unknown>>>;
}
