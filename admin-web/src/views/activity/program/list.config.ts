import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const programStatusOptions = (t: Translate): UniOption[] => [
  { label: t('activity.programStatusPending'), value: '0' },
  { label: t('activity.programStatusProgress'), value: '1' },
  { label: t('activity.programStatusEnded'), value: '2' }
]

export const programTypeOptions = (t: Translate): UniOption[] => [
  { label: t('activity.programTypeLottery'), value: '1' },
  { label: t('activity.programTypeCompetition'), value: '2' },
  { label: t('activity.programTypeBlessing'), value: '3' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  statusOptions: UniOption[],
  typeOptions: UniOption[],
  showSchoolFilter: boolean
): UniFormConfig => ({
  schema: [
    {
      field: 'activityKeyword',
      component: 'ElInput',
      label: '',
      componentProps: { placeholder: t('activity.activityKeyword'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'programKeyword',
      component: 'ElInput',
      label: '',
      componentProps: { placeholder: t('activity.programKeyword'), clearable: true },
      colProps: { span: 6 }
    },
    ...(showSchoolFilter
      ? ([
          {
            field: 'schoolIds',
            component: 'ElSelect',
            label: '',
            options: schoolOptions,
            componentProps: {
              placeholder: t('activity.selSchool'),
              clearable: true,
              filterable: true
            },
            colProps: { span: 6 }
          }
        ] as UniFormConfig['schema'])
      : []),
    {
      field: 'programStatus',
      component: 'ElSelect',
      label: '',
      options: statusOptions,
      componentProps: { placeholder: t('activity.programStatusLabel'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'programType',
      component: 'ElSelect',
      label: '',
      options: typeOptions,
      componentProps: { placeholder: t('activity.programType'), clearable: true },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', minWidth: 88 },
  { prop: 'activityId', label: t('activity.colActivityId'), minWidth: 96 },
  {
    prop: 'programStatusLabel',
    label: t('activity.programStatusLabel'),
    minWidth: 100
  },
  { prop: 'cnName', label: t('activity.eventNameCn'), minWidth: 120 },
  { prop: 'enName', label: t('activity.eventNameEn'), minWidth: 120 },
  {
    prop: 'programTypeLabel',
    label: t('activity.programType'),
    minWidth: 96
  },
  {
    prop: 'sortOrder',
    label: t('activity.colProgramOrder'),
    minWidth: 96
  },
  {
    prop: 'totalRounds',
    label: t('activity.colTotalRounds'),
    minWidth: 96
  },
  {
    prop: 'currentRound',
    label: t('activity.colCurrentRound'),
    minWidth: 96
  },
  { prop: 'operator', label: t('activity.colOperator'), minWidth: 100 },
  { prop: 'operateTime', label: t('activity.colOperateTime'), minWidth: 156 }
]
