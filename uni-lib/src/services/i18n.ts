import type { Ref } from "vue";

export interface UniI18nBridge {
  t: (key: string, params?: Record<string, unknown>) => string;
  locale: () => string;
  setLocale?: (locale: string) => void;
  /**
   * 建议与 vue-i18n 等配合传入（例如 `i18n.global.locale`），
   * 语言切换时 Element Plus 原子组件（日期、分页等）才能同步更新。
   */
  localeRef?: Ref<string>;
}

let bridge: UniI18nBridge | undefined;
let bridgeLocaleRef: Ref<string> | undefined;

export const createUniI18nBridge = (nextBridge: UniI18nBridge) => {
  bridge = nextBridge;
  bridgeLocaleRef = nextBridge.localeRef;
  return bridge;
};

/** 供 {@link UniConfigProvider} 使用：存在时随语言切换驱动 Element Plus locale */
export const useUniLocaleRef = () => bridgeLocaleRef;

export const useUniI18n = () => ({
  t: (key: string, params?: Record<string, unknown>) =>
    bridge?.t(key, params) ?? key,
  locale: () => bridge?.locale() ?? "zh-CN",
  setLocale: (locale: string) => bridge?.setLocale?.(locale),
});
