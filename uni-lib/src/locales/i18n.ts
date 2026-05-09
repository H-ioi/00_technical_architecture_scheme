import { useI18n } from "vue-i18n";

/**
 * 组件库内访问全局文案（须在组件 `setup` / `<script setup>` 同步调用链上使用）。
 * 模板可直接 `$t('key')`（依赖 {@link createUniLibI18n} 的 `globalInjection`）。
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
