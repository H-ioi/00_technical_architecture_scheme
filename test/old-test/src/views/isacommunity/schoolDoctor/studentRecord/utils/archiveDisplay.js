/** 判断字段是否有可展示内容 */
export function hasDisplayValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/** 从附件 URL 提取文件名 */
export function getFileNameFromUrl(url) {
  if (!url) return "";
  try {
    const pathname = url.split("?")[0];
    const parts = pathname.split("/");
    return decodeURIComponent(parts[parts.length - 1] || "");
  } catch (error) {
    return url;
  }
}

/** 拼接年级班级 */
export function formatGradeClass(grade, formCode) {
  const parts = [grade, formCode].filter((item) => hasDisplayValue(item));
  return parts.join(" ");
}

/** 健康指标字符串转数字（供数字输入框） */
export function parseMetricNumber(value) {
  if (value === null || value === undefined || value === "") return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

/** 健康指标数字转接口字符串 */
export function formatMetricValue(value) {
  if (value === null || value === undefined || value === "") return "";
  return String(value);
}
