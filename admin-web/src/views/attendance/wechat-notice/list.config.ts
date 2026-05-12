import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 发送状态（与旧搜索下拉一致：`0` 成功，`1` 失败）。 */
export const wechatNoticeSendStatusOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.wechatNotice.options.sendOk'), value: 0, type: 'success' },
  { label: t('attendance.wechatNotice.options.sendFail'), value: 1, type: 'danger' }
]

export const attendanceWechatNoticeSearchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  sendStatusOptions: UniOption[]
): UniFormConfig => ({
  schema: [
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('attendance.wechatNotice.placeholders.school'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'admissionNo',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.wechatNotice.placeholders.admissionNo'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'personName',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.wechatNotice.placeholders.personName'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'openId',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.wechatNotice.placeholders.openId'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'sendStatus',
      label: '',
      component: 'ElSelect',
      options: sendStatusOptions,
      componentProps: {
        placeholder: t('attendance.wechatNotice.placeholders.sendStatus'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'beginDate',
      label: '',
      component: 'ElDatePicker',
      componentProps: {
        type: 'date',
        placeholder: t('attendance.wechatNotice.placeholders.beginDate'),
        valueFormat: 'YYYY-MM-DD',
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'endDate',
      label: '',
      component: 'ElDatePicker',
      componentProps: {
        type: 'date',
        placeholder: t('attendance.wechatNotice.placeholders.endDate'),
        valueFormat: 'YYYY-MM-DD',
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const attendanceWechatNoticeColumns = (
  t: Translate,
  schoolOptions: UniOption[]
): UniTableColumn[] => [
  {
    prop: 'id',
    label: t('attendance.wechatNotice.columns.id'),
    type: 'text',
    width: 90,
    fixed: 'left'
  },
  {
    prop: 'schoolId',
    label: t('attendance.wechatNotice.columns.schoolName'),
    type: 'text',
    options: schoolOptions,
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'admissionNo',
    label: t('attendance.wechatNotice.columns.admissionNo'),
    type: 'text',
    minWidth: 110,
    showOverflowTooltip: true
  },
  {
    prop: 'personName',
    label: t('attendance.wechatNotice.columns.personName'),
    type: 'text',
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'sendStatus',
    label: t('attendance.wechatNotice.columns.sendStatus'),
    type: 'text',
    width: 90
  },
  {
    prop: 'sendOpenId',
    label: t('attendance.wechatNotice.columns.sendOpenId'),
    type: 'text',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'result',
    label: t('attendance.wechatNotice.columns.result'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'updateTime',
    label: t('attendance.wechatNotice.columns.updateTime'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'createTime',
    label: t('attendance.wechatNotice.columns.createTime'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  }
]

export const attendanceWechatNoticeDetailForm = (
  t: Translate,
  schoolOptions: UniOption[]
): UniFormConfig => ({
  mode: 'view',
  formProps: { labelWidth: '110px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  view: { emptyText: '-' },
  schema: [
    { field: 'id', label: t('attendance.wechatNotice.columns.id'), component: 'ElInput' },
    {
      field: 'schoolId',
      label: t('attendance.wechatNotice.columns.schoolName'),
      component: 'ElInput',
      viewType: 'enum',
      options: schoolOptions
    },
    {
      field: 'admissionNo',
      label: t('attendance.wechatNotice.columns.admissionNo'),
      component: 'ElInput'
    },
    {
      field: 'personName',
      label: t('attendance.wechatNotice.columns.personName'),
      component: 'ElInput'
    },
    {
      field: 'sendStatus',
      label: t('attendance.wechatNotice.columns.sendStatus'),
      component: 'ElInput'
    },
    {
      field: 'sendOpenId',
      label: t('attendance.wechatNotice.columns.sendOpenId'),
      component: 'ElInput'
    },
    { field: 'result', label: t('attendance.wechatNotice.columns.result'), component: 'ElInput' },
    {
      field: 'updateTime',
      label: t('attendance.wechatNotice.columns.updateTime'),
      component: 'ElInput'
    },
    {
      field: 'createTime',
      label: t('attendance.wechatNotice.columns.createTime'),
      component: 'ElInput'
    }
  ]
})
