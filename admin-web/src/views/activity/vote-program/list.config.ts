import type { UniFormConfig, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const searchForm = (t: Translate): UniFormConfig => ({
  schema: [
    {
      field: 'keyword',
      component: 'ElInput',
      label: '',
      componentProps: { placeholder: t('activity.voteKeyword'), clearable: true },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', minWidth: 88 },
  { prop: 'programName', label: t('activity.voteProgramProject'), minWidth: 150 },
  { prop: 'cnName', label: t('activity.eventNameCn'), minWidth: 130 },
  { prop: 'enName', label: t('activity.eventNameEn'), minWidth: 130 },
  { prop: 'performer', label: t('activity.votePerformer'), minWidth: 180, showOverflowTooltip: true }
]
