import en from "element-plus/es/locale/lang/en.mjs";
import zhCn from "element-plus/es/locale/lang/zh-cn.mjs";

import type { ElementPlusLocale } from "@/types/uni-element-plus-locale";

export type { ElementPlusLocale } from "@/types/uni-element-plus-locale";

/**
 * 将业务语言代码（如 vue-i18n 的 `locale`）映射为 Element Plus 语言包。
 * 未匹配时默认中文，避免日期、分页等原子组件回退为英文。
 */
export function resolveElementPlusLocale(
  code: string | undefined | null,
): ElementPlusLocale {
  if (code == null || code === "") {
    return zhCn;
  }

  const normalized = String(code).toLowerCase().replace(/_/g, "-");

  if (normalized === "en" || normalized.startsWith("en-")) {
    return en;
  }

  if (normalized.startsWith("zh")) {
    return zhCn;
  }

  return zhCn;
}
