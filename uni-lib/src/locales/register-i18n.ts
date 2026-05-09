import type { I18n } from "vue-i18n";

let uniLibI18nInstance: I18n | null = null;

/** 由 {@link createUniLibI18n} 写入；勿在业务侧重复注册多套实例。 */
export const registerUniLibI18nInstance = (instance: I18n) => {
  uniLibI18nInstance = instance;
};

export const tryGetUniLibI18nInstance = (): I18n | null => uniLibI18nInstance;

/** 供指令、回调等非 setup 上下文调用（依赖已注册的实例）。在非 setup 下用收窄后的 `t`，避免 TS 对 `global.t` 联合签名报错。 */
const globalTranslate = (
  i18n: I18n,
  key: string,
  params?: Record<string, unknown>,
): string => {
  const tFn = i18n.global.t as (
    key: string,
    values?: Record<string, unknown>,
  ) => string;

  return params !== undefined && Object.keys(params).length > 0
    ? tFn(key, params)
    : tFn(key);
};

export const uniLibTranslate = (
  key: string,
  params?: Record<string, unknown>,
): string => {
  const i18n = tryGetUniLibI18nInstance();
  if (!i18n) {
    return key;
  }

  return globalTranslate(i18n, key, params);
};
