import { persistLocale, syncNavigationBarForCurrentRoute } from "@/locales";
import { LOCALE_SHORT_LABELS, SUPPORTED_LOCALES, type AppLocale } from "@/locales/constants";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

export function nextAppLocale(current: AppLocale): AppLocale {
  const idx = SUPPORTED_LOCALES.indexOf(current);
  const nextIdx = idx < 0 ? 0 : (idx + 1) % SUPPORTED_LOCALES.length;
  return SUPPORTED_LOCALES[nextIdx] ?? SUPPORTED_LOCALES[0];
}

export function useLocaleSwitcher() {
  const { locale } = useI18n();

  function setLocale(next: AppLocale) {
    locale.value = next;
    persistLocale(next);
    syncNavigationBarForCurrentRoute();
  }

  function cycleLocale() {
    setLocale(nextAppLocale(locale.value as AppLocale));
  }

  const nextLocaleShortLabel = computed(() => {
    const next = nextAppLocale(locale.value as AppLocale);
    return LOCALE_SHORT_LABELS[next];
  });

  return {
    cycleLocale,
    nextLocaleShortLabel,
  };
}
