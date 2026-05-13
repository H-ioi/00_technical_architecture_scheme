/**
 * 后台接口响应信封 / 分页结构在历史演进与各模块间不一致，前端需在取值前做统一映射。
 *
 * 已观测形态（不同接口混用，故集中在此兼容）：
 * - 分页：顶层 `{ records, total }`（Spring Page）；顶层 `{ list, totalCount }`（Flowable 待办等）；
 *   顶层 `{ data: T[] }`；顶层 `{ total / totalCount / totalElements / totalRow }` + 嵌套 `{ records | list | data | content }`；
 *   群发邮件等：`{ totalCount, data: { records | data } }`。
 * - 单体：`{ data: { ...实体 } }` 或顶层即实体；会员检索偶见 `{ data: { data: ... } }`。
 * - 列表（非分页）：`T[]` 或 `{ data: T[] }`。
 */

type Loose = Record<string, unknown>

function toFiniteNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

/** 从多个对象上依次尝试读取分页总量字段。 */
function pickTotal(...objs: (Loose | undefined | null)[]): number {
  for (const o of objs) {
    if (!o || typeof o !== 'object') {
      continue
    }
    const v =
      toFiniteNumber(o.total) ||
      toFiniteNumber(o.totalCount) ||
      toFiniteNumber(o.totalElements) ||
      toFiniteNumber(o.totalRow)
    if (v) {
      return v
    }
  }
  return 0
}

/** 嵌套分页对象内常见的列表字段顺序（与校车司机列表等本地 unwrap 保持一致）。 */
function extractListFromNested(obj: Loose): unknown[] | null {
  const keys = ['records', 'list', 'data', 'content'] as const
  for (const k of keys) {
    const v = obj[k]
    if (Array.isArray(v)) {
      return v
    }
  }
  return null
}

/**
 * 分页列表：统一得到 `{ list, total }`，供 UniDataTable 等使用。
 */
export function normalizeApiPagedBody<T = unknown>(raw: unknown): { list: T[]; total: number } {
  const empty: { list: T[]; total: number } = { list: [], total: 0 }

  if (Array.isArray(raw)) {
    return { list: raw as T[], total: raw.length }
  }

  if (!raw || typeof raw !== 'object') {
    return empty
  }

  const r = raw as Loose

  if (Array.isArray(r.data)) {
    return { list: r.data as T[], total: pickTotal(r) }
  }
  if (Array.isArray(r.records)) {
    return { list: r.records as T[], total: pickTotal(r) }
  }
  if (Array.isArray(r.list)) {
    return { list: r.list as T[], total: pickTotal(r) }
  }

  const inner = r.data
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    const obj = inner as Loose
    const extracted = extractListFromNested(obj)
    if (extracted) {
      return { list: extracted as T[], total: pickTotal(r, obj) }
    }
  }

  const tailTotal = pickTotal(r)
  return tailTotal > 0 ? { list: [], total: tailTotal } : empty
}

/**
 * 单层信封：`{ data: 对象 }` → 内层对象；否则返回顶层（群发详情、请假详情等多接口共用）。
 */
export function normalizeApiEnvelope(raw: unknown): Loose {
  if (!raw || typeof raw !== 'object') {
    return {}
  }
  const r = raw as Loose
  const inner = r.data
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    return inner as Loose
  }
  return r
}

/**
 * 会员 / 检索类接口：可能单层 `{ data }`，也可能双层 `{ data: { data } }`；原始值非对象时原样返回。
 */
export function normalizeApiPayload(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object') {
    return raw
  }
  const r = raw as Loose
  const d = r.data
  if (d !== undefined && d !== null && typeof d === 'object' && !Array.isArray(d)) {
    const inner = d as Loose
    if ('data' in inner) {
      const dd = inner.data
      if (Array.isArray(dd)) {
        return dd
      }
      if (dd !== null && typeof dd === 'object') {
        return dd
      }
    }
    return d
  }
  return raw
}

/**
 * 仅抽取数组主体（下拉选项、配置行、`data` 直出数组等）。
 */
export function normalizeApiArrayBody(raw: unknown): unknown[] {
  const u = normalizeApiPayload(raw)
  if (Array.isArray(u)) {
    return u
  }
  if (u && typeof u === 'object') {
    const o = u as Loose
    if (Array.isArray(o.data)) {
      return o.data as unknown[]
    }
    if (Array.isArray(o.records)) {
      return o.records as unknown[]
    }
    const nested = extractListFromNested(o)
    if (nested) {
      return nested
    }
  }
  const { list } = normalizeApiPagedBody(raw)
  return list
}

/**
 * 详情接口：信封内对象优先；无效输入返回 `null`（下单编辑弹窗等）。
 */
export function normalizeApiDetailBody(raw: unknown): Loose | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const r = raw as Loose
  const d = r.data
  if (d !== undefined && d !== null && typeof d === 'object' && !Array.isArray(d)) {
    return d as Loose
  }
  return r as Loose
}

/**
 * 校车详情接口：常见 `{ data: { success, data: 实体 } }`，或直接 `{ data: 实体 }`；
 * 与路线弹窗内 `unwrapLineDetail` / 站点学时弹窗逻辑一致。
 */
export function normalizeSchoolBusDetailBody(res: unknown): Loose | null {
  if (res == null || typeof res !== 'object') {
    return null
  }
  const r = res as Loose
  const d = r.data

  if (d && typeof d === 'object' && !Array.isArray(d)) {
    const inner = d as Loose

    if (inner.success === true && inner.data != null && typeof inner.data === 'object') {
      return inner.data as Loose
    }

    if ('schoolIds' in inner || 'weekDays' in inner || 'cnName' in inner) {
      return inner as Loose
    }
  }

  if ('schoolIds' in r || 'weekDays' in r || 'cnName' in r) {
    return r as Loose
  }

  return null
}
