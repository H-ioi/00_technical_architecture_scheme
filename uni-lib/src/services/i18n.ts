export interface UniI18nBridge {
  t: (key: string, params?: Record<string, unknown>) => string;
  locale: () => string;
  setLocale?: (locale: string) => void;
}

let bridge: UniI18nBridge | undefined;

export const createUniI18nBridge = (nextBridge: UniI18nBridge) => {
  bridge = nextBridge;
  return bridge;
};

export const useUniI18n = () => ({
  t: (key: string, params?: Record<string, unknown>) =>
    bridge?.t(key, params) ?? key,
  locale: () => bridge?.locale() ?? "zh-CN",
  setLocale: (locale: string) => bridge?.setLocale?.(locale),
});
