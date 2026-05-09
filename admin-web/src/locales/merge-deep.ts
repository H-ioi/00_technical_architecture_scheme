/**
 * 深度合并文案对象：后者覆盖前者；仅处理普通对象，不拷贝原型。
 * 用于将 uni-lib 默认文案作为基底，再由业务语言包覆盖。
 */
export function mergeDeep<T extends Record<string, unknown>>(
  base: T,
  override: Record<string, unknown>,
): T {
  const out: Record<string, unknown> = { ...base };

  for (const key of Object.keys(override)) {
    const oVal = override[key];
    const bVal = out[key];

    if (
      oVal !== null &&
      typeof oVal === "object" &&
      !Array.isArray(oVal) &&
      bVal !== null &&
      typeof bVal === "object" &&
      !Array.isArray(bVal)
    ) {
      out[key] = mergeDeep(
        bVal as Record<string, unknown>,
        oVal as Record<string, unknown>,
      );
    } else {
      out[key] = oVal;
    }
  }

  return out as T;
}
