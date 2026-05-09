import { useI18n } from "vue-i18n";

/**
 * 组件库在 `<script setup>` 中访问全局 vue-i18n（与 {@link createUniLibI18n} 配套）。
 * 模板可直接使用 `$t`（`globalInjection: true`）。
 */
export const useUniI18n = () => {
  const { t, locale } = useI18n({ useScope: "global" });

  return {
    t: (key: string, params?: Record<string, unknown>) =>
      String(
        params !== undefined && Object.keys(params).length > 0
          ? t(key, params as Record<string, unknown> & object)
          : t(key),
      ),
    locale: () => String(locale.value),
    setLocale: (next: string) => {
      locale.value = next;
    },
  };
};
