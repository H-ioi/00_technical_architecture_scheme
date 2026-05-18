/** 菜单 i18n 命名空间，按优先级查找（菜单词条统一在 isagroup） */
const I18N_NAMESPACES = [
  "isagroup",
  "consult",
  "mail",
  "attendance",
  "common",
  "route",
];

/**
 * 从后端 menufiled 读取英文名称
 * @param {Object} item
 * @returns {string}
 */
function getMenuFieldEn(item) {
  const fields = item.menufiled || item.menuFiled;
  if (!Array.isArray(fields)) return "";
  const en = fields.find((f) => f.sysMenuType === "en_US");
  return en && en.sysMenuValue ? String(en.sysMenuValue).trim() : "";
}

/**
 * 在前端词典中查找翻译
 * @param {import('vue-i18n').default} i18n
 * @param {string} key
 * @returns {string}
 */
function lookupI18n(i18n, key) {
  if (!key || !i18n) return "";
  for (let i = 0; i < I18N_NAMESPACES.length; i++) {
    const ns = I18N_NAMESPACES[i];
    const path = `${ns}.${key}`;
    if (i18n.te(path)) {
      const val = i18n.t(path);
      if (val && val !== key) return val;
    }
  }
  return "";
}

/**
 * 解析菜单英文展示名：优先后端 en_US，再查前端 i18n
 * @param {Object} item 菜单项
 * @param {import('vue-i18n').default} i18n
 * @param {string} labelKey
 * @returns {string}
 */
export function resolveMenuLabel(item, i18n, labelKey = "label") {
  const zhLabel = item[labelKey] || item.label || item.name || "";
  const enFromApi = getMenuFieldEn(item);
  if (enFromApi && enFromApi !== zhLabel) return enFromApi;

  const keys = [zhLabel, item.name, item.label].filter(Boolean);
  const uniqueKeys = [...new Set(keys)];
  for (let i = 0; i < uniqueKeys.length; i++) {
    const translated = lookupI18n(i18n, uniqueKeys[i]);
    if (translated) return translated;
  }
  return enFromApi || zhLabel;
}

/**
 * 按当前语言返回菜单展示名
 * @param {Object} item
 * @param {import('vue-i18n').default} i18n
 * @param {string} locale
 * @param {string} labelKey
 * @returns {string}
 */
export function resolveMenuLabelByLocale(item, i18n, locale, labelKey = "label") {
  const zhLabel = item[labelKey] || item.label || item.name || "";
  if (locale !== "en") return zhLabel;
  return resolveMenuLabel(item, i18n, labelKey);
}
