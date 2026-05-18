import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const searchForm = (t: Translate, programOptions: UniOption[]): UniFormConfig => ({
  schema: [
    {
      field: 'keyword',
      component: 'ElInput',
      label: '',
      componentProps: { placeholder: t('activity.prizeKeyword'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'programId',
      component: 'ElSelect',
      label: '',
      options: programOptions,
      componentProps: {
        placeholder: t('activity.prizeProgram'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', minWidth: 88 },
  { prop: 'cnName', label: t('activity.prizeCnName'), minWidth: 130 },
  { prop: 'enName', label: t('activity.prizeEnName'), minWidth: 130 },
  { prop: 'programName', label: t('activity.prizeProgram'), minWidth: 140 },
  { prop: 'amount', label: t('activity.prizeAmount'), minWidth: 100 },
  {
    prop: 'imageUrl',
    label: t('activity.prizeImage'),
    type: 'image',
    width: 88,
    image: { width: 44, height: 44, preview: true }
  },
  { prop: 'createTime', label: t('activity.colCreateTime'), minWidth: 156 },
  { prop: 'updateTime', label: t('activity.colUpdateTime'), minWidth: 156 }
]
