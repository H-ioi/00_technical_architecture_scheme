import { createI18n } from "vue-i18n";

import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isAppLocale,
  type AppLocale,
} from "./constants";

import messagesEnUS from "./lang/en-US";
import messagesJaJP from "./lang/ja-JP";
import messagesKoKR from "./lang/ko-KR";
import messagesZhCN from "./lang/zh-CN";

function readStoredLocale(): AppLocale {
  try {
    const raw = uni.getStorageSync(LOCALE_STORAGE_KEY);
    if (typeof raw === "string" && isAppLocale(raw)) {
      return raw;
    }
  } catch {
    // ignore
  }

  return DEFAULT_LOCALE;
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: readStoredLocale(),
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

export function applyTabBarTexts() {
  const t = i18n.global.t;
  uni.setTabBarItem({
    index: 0,
    text: String(t("tab.home")),
  });
  uni.setTabBarItem({
    index: 1,
    text: String(t("tab.mine")),
  });
}

export function syncNavigationBarForCurrentRoute() {
  const pages = getCurrentPages();
  const top = pages[pages.length - 1];
  const route = top?.route ?? "";
  const t = i18n.global.t;

  if (route.includes("pages/home/index")) {
    uni.setNavigationBarTitle({ title: String(t("nav.homeTitle")) });
  } else if (route.includes("pages/mine/index")) {
    uni.setNavigationBarTitle({ title: String(t("nav.mineTitle")) });
  }
}
