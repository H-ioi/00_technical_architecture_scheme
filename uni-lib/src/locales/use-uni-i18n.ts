import { useI18n } from 'vue-i18n'

/**
 * 组件库在 `<script setup>` 中访问全局 vue-i18n（与 {@link createUniLibI18n} 配套）。
 * `createUniLibI18n` 已开启 `globalInjection: true`，模板里请用 **`$t('key')`**；
 * 脚本里请解构 **`const { t } = useUniI18n()`** 后调用 `t('key')`（与 `$t` 等价）。
 */
export const useUniI18n = () => {
  const { t, locale } = useI18n({ useScope: 'global' })

  return {
    t: (key: string, params?: Record<string, unknown>) =>
      String(params !== undefined && Object.keys(params).length > 0 ? t(key, params as Record<string, unknown> & object) : t(key)),
    locale: () => String(locale.value),
    setLocale: (next: string) => {
      locale.value = next
    }
  }
}
