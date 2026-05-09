import { createI18n } from "vue-i18n";
import type { I18nOptions } from "vue-i18n";

import { UNI_DEFAULT_LOCALE, type UniAppLocale } from "@/types/i18n";

import { enMessagesNested } from "./lang/en";
import { zhCNMessagesNested } from "./lang/zh-CN";
import { mergeDeep } from "./merge-deep";
import { registerUniLibI18nInstance } from "./register-i18n";

export interface CreateUniLibI18nOptions {
  locale?: UniAppLocale;
  fallbackLocale?: UniAppLocale;
  /** 宿主文案；与库文案深度合并，同路径下宿主覆盖库。 */
  hostMessages?: Partial<Record<UniAppLocale, Record<string, unknown>>>;
}

/**
 * 创建供组件库与宿主共用的 vue-i18n 实例（单一数据源）。
 * 调用方需在 Pinia / Router 之后就绪后执行 `app.use(i18n)`。
 */
export function createUniLibI18n(options: CreateUniLibI18nOptions = {}) {
  const locale = options.locale ?? UNI_DEFAULT_LOCALE;
  const fallback = options.fallbackLocale ?? locale;

  const zhMerged = mergeDeep(
    zhCNMessagesNested as unknown as Record<string, unknown>,
    options.hostMessages?.["zh-CN"] ?? {},
  );

  const enMerged = mergeDeep(
    enMessagesNested as unknown as Record<string, unknown>,
    options.hostMessages?.en ?? {},
  );

  const i18nOptions = {
    legacy: false,
    locale,
    fallbackLocale: fallback,
    messages: {
      "zh-CN": zhMerged,
      en: enMerged,
    },
    globalInjection: true,
    missingWarn: false,
    fallbackWarn: false,
  } as unknown as I18nOptions;

  const i18n = createI18n(i18nOptions);

  registerUniLibI18nInstance(i18n);

  return i18n;
}
