import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 问卷列表检索（导出命名与各模块 list.config 的 searchForm 对齐） */
export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  activityOptions: UniOption[],
  ynDispOptions: UniOption[]
): UniFormConfig => ({
  schema: [
    {
      field: 'name',
      component: 'ElInput',
      label: '',
      componentProps: { placeholder: t('activity.questionnaireName'), clearable: true },
      colProps: { span: 6 }
    },
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
    },
    {
      field: 'activityId',
      component: 'ElSelect',
      label: '',
      options: activityOptions,
      componentProps: {
        placeholder: t('activity.questionnaireActivity'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'status',
      component: 'ElSelect',
      label: '',
      options: ynDispOptions,
      componentProps: { placeholder: t('activity.questionnaireValid'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'createStartTime',
      component: 'ElDatePicker',
      label: '',
      componentProps: {
        type: 'datetime',
        placeholder: t('activity.timeStart'),
        clearable: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      colProps: { span: 6 }
    },
    {
      field: 'createEndTime',
      component: 'ElDatePicker',
      label: '',
      componentProps: {
        type: 'datetime',
        placeholder: t('activity.timeEnd'),
        clearable: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

/** 问卷列表列（与 `member/student` 等模块的 `tableCols` 命名一致） */
export const tableCols = (
  t: Translate,
  schoolOptions: UniOption[],
  ynDispOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: 'ID', width: 100 },
  { prop: 'name', label: t('activity.questionnaireName'), minWidth: 140 },
  {
    prop: 'schoolIds',
    label: t('activity.colSchool'),
    type: 'array',
    options: schoolOptions,
    lookup: { splitValues: true },
    minWidth: 240,
    showOverflowTooltip: true
  },
  { prop: 'activityName', label: t('activity.colActivityName'), minWidth: 120 },
  {
    prop: 'status',
    label: t('activity.questionnaireValid'),
    type: 'tag',
    options: ynDispOptions,
    width: 100
  },
  {
    prop: 'frozen',
    label: t('activity.questionnaireFrozen'),
    type: 'tag',
    options: ynDispOptions,
    width: 100
  },
  {
    prop: 'needStudentInfo',
    label: t('activity.questionnaireNeedStudent'),
    type: 'tag',
    options: ynDispOptions,
    width: 130
  },
  { prop: 'instructions', label: t('activity.colInstructions'), minWidth: 160 },
  { prop: 'updateTime', label: t('activity.colUpdated'), width: 168 },
  { prop: 'createTime', label: t('activity.colCreated'), width: 168 }
]
