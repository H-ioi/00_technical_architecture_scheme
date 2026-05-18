/**
 * 活动详情子 Tab 分页接口常见 data 形态：records / content / list / data / data.records
 */
export function extractPageList(payload) {
  if (!payload || typeof payload !== "object") {
    return [];
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload.records)) {
    return payload.records;
  }
  if (Array.isArray(payload.content)) {
    return payload.content;
  }
  if (Array.isArray(payload.list)) {
    return payload.list;
  }
  if (Array.isArray(payload.data)) {
    return payload.data;
  }
  if (
    payload.data &&
    typeof payload.data === "object" &&
    Array.isArray(payload.data.records)
  ) {
    return payload.data.records;
  }
  return [];
}

/** 分页 total 原始值；无字段时 null（导出全量轮询时与「未知总数」区分） */
export function pageTotalOrNull(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  if (payload.total !== undefined && payload.total !== null) {
    return payload.total;
  }
  if (payload.totalElements != null) {
    return payload.totalElements;
  }
  return null;
}

/** 列表底部分页 total：兼容 MyBatis-Plus total / totalElements */
export function totalFromPagePayload(payload) {
  const t = pageTotalOrNull(payload);
  return t == null ? 0 : t;
}
