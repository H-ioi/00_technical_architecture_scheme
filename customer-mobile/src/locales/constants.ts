export const LOCALE_STORAGE_KEY = "customer-mobile-locale";

export type AppLocale = "zh-CN" | "en-US" | "ja-JP" | "ko-KR";

export const SUPPORTED_LOCALES: AppLocale[] = ["zh-CN", "en-US", "ja-JP", "ko-KR"];

export const DEFAULT_LOCALE: AppLocale = "zh-CN";

export function isAppLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

/** 语言选择器展示名（与用户当前界面语言无关，固定本地化名） */
export const LOCALE_DISPLAY_NAMES: Record<AppLocale, string> = {
  "zh-CN": "简体中文",
  "en-US": "English",
  "ja-JP": "日本語",
  "ko-KR": "한국어",
};
