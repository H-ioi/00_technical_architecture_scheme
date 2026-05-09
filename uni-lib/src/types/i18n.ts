/**
 * 组件库约定的界面语言，与内置文案键、Element Plus 语言包保持一致。
 * 模板项目应优先使用本模块类型，而非各自维护一份语言枚举。
 */
export const uniSupportedLocales = ["zh-CN", "en"] as const;

export type UniAppLocale = (typeof uniSupportedLocales)[number];

export const UNI_DEFAULT_LOCALE: UniAppLocale = "zh-CN";

export const isUniAppLocale = (value: string): value is UniAppLocale =>
  (uniSupportedLocales as readonly string[]).includes(value);
