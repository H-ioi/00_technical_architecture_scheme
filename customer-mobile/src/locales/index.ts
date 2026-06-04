import { createI18n } from "vue-i18n";

import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, isAppLocale, type AppLocale } from "./constants";

import messagesEnUS from "./lang/en-US";
import messagesJaJP from "./lang/ja-JP";
import messagesKoKR from "./lang/ko-KR";
import messagesZhCN from "./lang/zh-CN";

function readStoredLocale(): AppLocale | null {
  try {
    const raw = uni.getStorageSync(LOCALE_STORAGE_KEY);
    if (typeof raw === "string" && isAppLocale(raw)) {
      return raw;
    }
  } catch {
    // ignore
  }

  return null;
}

function mapToSupportedLocale(locale: string): AppLocale | null {
  const normalized = locale.trim().toLowerCase().replace("_", "-");

  if (normalized === "zh-cn" || normalized.startsWith("zh")) {
    return "zh-CN";
  }
  if (normalized === "en-us" || normalized.startsWith("en")) {
    return "en-US";
  }
  if (normalized === "ja-jp" || normalized.startsWith("ja")) {
    return "ja-JP";
  }
  if (normalized === "ko-kr" || normalized.startsWith("ko")) {
    return "ko-KR";
  }

  return null;
}

function detectSystemLocale(): AppLocale {
  try {
    const systemLanguage = uni.getSystemInfoSync().language;
    if (typeof systemLanguage === "string") {
      const matched = mapToSupportedLocale(systemLanguage);
      if (matched) {
        return matched;
      }
    }
  } catch {
    // ignore
  }

  if (typeof navigator !== "undefined" && typeof navigator.language === "string") {
    const matched = mapToSupportedLocale(navigator.language);
    if (matched) {
      return matched;
    }
  }

  return DEFAULT_LOCALE;
}

function resolveInitialLocale(): AppLocale {
  const stored = readStoredLocale();
  if (stored) {
    return stored;
  }

  return detectSystemLocale();
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: resolveInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    "zh-CN": messagesZhCN,
    "en-US": messagesEnUS,
    "ja-JP": messagesJaJP,
    "ko-KR": messagesKoKR,
  },
});

export default i18n;

export function persistLocale(locale: AppLocale) {
  uni.setStorageSync(LOCALE_STORAGE_KEY, locale);
}

export function syncNavigationBarForCurrentRoute() {
  const pages = getCurrentPages();
  const top = pages[pages.length - 1];
  const route = top?.route ?? "";

  if (route.includes("pages/home/index")) {
    uni.setNavigationBarTitle({ title: String(i18n.global.t("nav.homeTitle")) });
  }
}
