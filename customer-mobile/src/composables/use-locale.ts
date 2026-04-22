import {
  LOCALE_DISPLAY_NAMES,
  type AppLocale,
  SUPPORTED_LOCALES,
} from "@/locales/constants";
import {
  applyTabBarTexts,
  persistLocale,
  syncNavigationBarForCurrentRoute,
} from "@/locales";
import { useI18n } from "vue-i18n";

export function useLocaleSwitcher() {
  const { locale } = useI18n();

  function setLocale(next: AppLocale) {
    locale.value = next;
    persistLocale(next);
    applyTabBarTexts();
    syncNavigationBarForCurrentRoute();
  }

  const localeOptions = SUPPORTED_LOCALES.map((code) => ({
    value: code,
    label: LOCALE_DISPLAY_NAMES[code],
  }));

  return {
    localeOptions,
    setLocale,
    currentLocale: locale as unknown as typeof locale,
  };
}
