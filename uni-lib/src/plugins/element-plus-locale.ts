import en from "element-plus/es/locale/lang/en.mjs";
import zhCn from "element-plus/es/locale/lang/zh-cn.mjs";

/** Element Plus 语言包对象类型（与 `zh-cn` 一致结构） */
export type ElementPlusLocale = typeof zhCn;

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
