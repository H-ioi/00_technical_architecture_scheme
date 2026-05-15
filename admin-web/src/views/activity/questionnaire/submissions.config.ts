import type { UniTableColumn } from 'uni-ui-lib'

import type { SubmissionColumnMeta } from '@/types/modules/activity-questionnaire'

/** 答卷表「附件」列 prop，对应 `#column-submissionAttach` 插槽 */
export const submissionAttachColumnProp = 'submissionAttach'

/** 与 `composeSubmissionRow` 单元格取值键一致：`__d_<templateFormFieldId>` */
export function submissionDisplayProp(fieldId: string): string {
  return `__d_${fieldId}`
}

/** 模板字段驱动列 → UniTable 列定义（取值键为 `submissionDisplayProp`） */
export function submissionTableCols(
  metas: SubmissionColumnMeta[],
  attachLabel: string
): UniTableColumn[] {
  const cols: UniTableColumn[] = metas.map((m) => ({
    prop: submissionDisplayProp(m.prop),
    label: m.label,
    type: 'text',
    minWidth: m.label.length * 10 + 60,
    showOverflowTooltip: true
  }))

  if (metas.some((c) => c.kind === 'upload')) {
    cols.push({
      prop: submissionAttachColumnProp,
      label: attachLabel,
      width: 160,
      fixed: 'right'
    })
  }

  return cols
}
