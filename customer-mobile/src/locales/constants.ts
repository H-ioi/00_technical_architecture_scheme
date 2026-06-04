export const LOCALE_STORAGE_KEY = "customer-mobile-locale";

export type AppLocale = "zh-CN" | "en-US" | "ja-JP" | "ko-KR";

export const SUPPORTED_LOCALES: AppLocale[] = ["zh-CN", "en-US", "ja-JP", "ko-KR"];

export const DEFAULT_LOCALE: AppLocale = "zh-CN";

export function isAppLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

/** 语言切换按钮短标签（展示「将切换到的」语言） */
export const LOCALE_SHORT_LABELS: Record<AppLocale, string> = {
  "zh-CN": "中",
  "en-US": "En",
  "ja-JP": "日",
  "ko-KR": "한",
};
