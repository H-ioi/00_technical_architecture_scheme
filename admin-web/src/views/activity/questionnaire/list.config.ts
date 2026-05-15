import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 问卷列表检索（与 `UniSearchForm` / `list.vue` 对齐） */
export function questionnaireSearchForm(
  t: Translate,
  schoolOptions: UniOption[],
  activityOptions: UniOption[],
  ynOptions: UniOption[]
): UniFormConfig {
  return {
    schema: [
      {
        field: 'name',
        component: 'ElInput',
        label: '',
        componentProps: { placeholder: t('activity.questionnaireName'), clearable: true },
        colProps: { span: 5 }
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
        colProps: { span: 5 }
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
        options: ynOptions,
        componentProps: { placeholder: t('activity.questionnaireValid'), clearable: true },
        colProps: { span: 4 }
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
        colProps: { span: 7 }
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
        colProps: { span: 7 }
      }
    ],
    rowProps: { gutter: 8 }
  }
}

/** 问卷列表列定义（校区列与 `member/student` 列表：`schoolIds` + `options` 映射） */
export function questionnaireTableColumns(
  t: Translate,
  schoolOptions: UniOption[],
  ynOptions: UniOption[]
): UniTableColumn[] {
  return [
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
      options: ynOptions,
      width: 100
    },
    {
      prop: 'frozen',
      label: t('activity.questionnaireFrozen'),
      type: 'tag',
      options: ynOptions,
      width: 100
    },
    {
      prop: 'needStudentInfo',
      label: t('activity.questionnaireNeedStudent'),
      type: 'tag',
      options: ynOptions,
      width: 130
    },
    { prop: 'instructions', label: t('activity.colInstructions'), minWidth: 160 },
    { prop: 'updateTime', label: t('activity.colUpdated'), width: 168 },
    { prop: 'createTime', label: t('activity.colCreated'), width: 168 }
  ]
}
