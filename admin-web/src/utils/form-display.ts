import type { UniOption } from 'uni-ui-lib'

/** 多选/单选值 → 选项 label，逗号拼接（详情只读展示） */
export function formatOptionLabels(options: UniOption[], value: unknown): string {
  const values = Array.isArray(value) ? value : value == null || value === '' ? [] : [value]
  return values
    .map((item) => {
      const hit = options.find((o) => String(o.value) === String(item))
      return hit?.label ?? String(item ?? '')
    })
    .filter(Boolean)
    .join(', ')
}
