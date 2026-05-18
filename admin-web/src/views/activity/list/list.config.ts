import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 活动状态（与旧 `consts.activityStatus` 取值一致）。 */
export const activityStatusOptions = (t: Translate): UniOption[] => [
  { label: t('activity.actStatus0'), value: '0' },
  { label: t('activity.actStatus1'), value: '1' },
  { label: t('activity.actStatus2'), value: '2' },
  { label: t('activity.actStatus3'), value: '3' }
]

/** 签到方式（与旧 `consts.activityCheckinMethod` 取值一致）。 */
export const checkinMethodOptions = (t: Translate): UniOption[] => [
  { label: t('activity.checkin0'), value: '0' },
  { label: t('activity.checkin1'), value: '1' },
  { label: t('activity.checkin2'), value: '2' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  ynOptions: UniOption[],
  statusOptions: UniOption[],
  showSchoolFilter: boolean
): UniFormConfig => ({
  schema: [
    {
      field: 'activityCnName',
      component: 'ElInput',
      label: '',
      componentProps: { placeholder: t('activity.eventNameCn'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'activityEnName',
      component: 'ElInput',
      label: '',
      componentProps: { placeholder: t('activity.eventNameEn'), clearable: true },
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
      field: 'activityStatus',
      component: 'ElSelect',
      label: '',
      options: statusOptions,
      componentProps: { placeholder: t('activity.colStatus'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'isBanner',
      component: 'ElSelect',
      label: '',
      options: ynOptions,
      componentProps: { placeholder: t('activity.colBanner'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'recommended',
      component: 'ElSelect',
      label: '',
      options: ynOptions,
      componentProps: { placeholder: t('activity.colRecommended'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'activityStartTime',
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
      field: 'activityEndTime',
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

export const tableCols = (
  t: Translate,
  schoolOptions: UniOption[],
  ynOptions: UniOption[],
  statusOptions: UniOption[],
  checkinOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: 'ID', width: 88 },
  {
    prop: 'activityStatus',
    label: t('activity.colStatus'),
    type: 'tag',
    options: statusOptions,
    width: 100
  },
  {
    prop: 'schoolIds',
    label: t('activity.colSchool'),
    type: 'array',
    options: schoolOptions,
    lookup: { splitValues: true },
    minWidth: 220,
    showOverflowTooltip: true
  },
  {
    prop: 'activityCnName',
    label: t('activity.eventNameCn'),
    minWidth: 220,
    showOverflowTooltip: true
  },
  {
    prop: 'activityEnName',
    label: t('activity.eventNameEn'),
    minWidth: 220,
    showOverflowTooltip: true
  },
  { prop: 'activityStartTime', label: t('activity.timeStart'), width: 168 },
  { prop: 'activityEndTime', label: t('activity.timeEnd'), width: 168 },
  {
    prop: 'recommended',
    label: t('activity.colRecommended'),
    type: 'tag',
    options: ynOptions,
    width: 100
  },
  {
    prop: 'banner',
    label: t('activity.colBanner'),
    type: 'tag',
    options: ynOptions,
    width: 120
  },
  {
    prop: 'magicNo',
    label: t('activity.colMagicNo'),
    minWidth: 120,
    showOverflowTooltip: true,
    copyable: true
  },
  { prop: 'ticketPrice', label: t('activity.colTicketPrice'), width: 100 },
  {
    prop: 'checkinMethod',
    label: t('activity.colCheckin'),
    type: 'tag',
    options: checkinOptions,
    width: 120
  },
  { prop: 'publisher', label: t('activity.colPublisher'), width: 100 },
  { prop: 'createTime', label: t('activity.colCreated'), width: 168 }
]
