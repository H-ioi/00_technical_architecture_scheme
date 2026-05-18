/** H5 管理用户：模块/角色选项与展示格式化 */

export const MODULE_OPTIONS = [
  { id: 1, label: "校巴", enLabel: "School Bus" },
  { id: 2, label: "活动", enLabel: "Activity" },
];

export const ROLE_OPTIONS = [
  { id: 1, label: "校巴运营", enLabel: "School Bus Operation" },
  { id: 2, label: "跟车老师", enLabel: "Car Teacher" },
  { id: 3, label: "活动签到", enLabel: "Activity Check-in" },
];

/** @param {*} value */
export function normalizeIdList(value) {
  if (value == null || value === "") return [];
  const list = Array.isArray(value) ? value : [value];
  return list.map((v) => Number(v)).filter((n) => !Number.isNaN(n));
}

/** 将任意校区 id 入参规范为可比较的字符串列表 */
export function normalizeSchoolIdValues(raw) {
  if (raw == null || raw === "") return [];
  if (typeof raw === "string") {
    const text = raw.trim();
    if (!text) return [];
    if (text.includes(",")) {
      return text
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");
    }
    return [text];
  }
  if (Array.isArray(raw)) {
    if (raw.length && typeof raw[0] === "object") {
      return raw.map((s) => s.id).filter((id) => id != null && id !== "").map(String);
    }
    return raw
      .filter((id) => id != null && id !== "")
      .map((id) => String(id));
  }
  return [String(raw)];
}

/** 兼容 schoolIds / school 等接口字段 */
export function normalizeSchoolIds(data = {}) {
  const d = data || {};
  let raw;
  if (d.schoolIds != null) {
    raw = d.schoolIds;
  } else if (d.school != null) {
    raw = d.school;
  } else {
    raw = d.schoolId;
  }
  return normalizeSchoolIdValues(raw);
}

/** 校区 id 是否在列表中（兼容字符串/数字） */
export function schoolIdIncluded(rawIds, schoolId) {
  const sid = schoolId != null ? String(schoolId) : "";
  if (!sid) return false;
  return normalizeSchoolIdValues(rawIds).some((x) => String(x) === sid);
}

export function formatOptionLabels(ids, options, i18nlocel = "zh") {
  const idSet = normalizeIdList(ids);
  if (idSet.length === 0) return "--";
  const labelList = options
    .filter((item) => idSet.includes(Number(item.id)))
    .map((item) => (i18nlocel === "en" ? item.enLabel : item.label));
  return labelList.length > 0 ? labelList.join(" / ") : "--";
}

/** 单行记录 → 校区展示文案（先按 id 在 schoolList 中匹配，再回退 record.school） */
export function resolveSchoolDisplayLabels(record, schoolList, getLabelFn) {
  var rec = record || {};
  var list = Array.isArray(schoolList) ? schoolList : [];
  var idStrs = normalizeSchoolIds(rec);
  var parts = [];
  for (var i = 0; i < idStrs.length; i++) {
    var sid = String(idStrs[i]);
    var j = 0;
    var found = null;
    for (; j < list.length; j++) {
      var sch = list[j];
      if (sch != null && String(sch.id) === sid) {
        found = sch;
        break;
      }
    }
    if (found != null && typeof getLabelFn === "function") {
      var lb = getLabelFn(found);
      if (lb != null && String(lb).trim() !== "") {
        parts.push(String(lb).trim());
      }
    }
  }
  if (parts.length > 0) {
    return parts.join(" / ");
  }
  var schText = rec.school;
  if (schText != null && String(schText).trim() !== "") {
    return String(schText).trim();
  }
  return "--";
}

export function formatSchoolLabels(schoolIds, schoolDictionary, getListLabel) {
  const ids = normalizeIdList(schoolIds);
  if (ids.length === 0) return "--";
  const labels = ids
    .map((id) => getListLabel(schoolDictionary, id, "enName", "id"))
    .filter((l) => l && l !== "--");
  return labels.length > 0 ? labels.join(" / ") : "--";
}
