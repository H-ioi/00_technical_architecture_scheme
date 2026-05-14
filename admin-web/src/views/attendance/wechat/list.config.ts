import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 微信 OpenID 状态（对齐旧 `consts.wechatOpenidType`，`0` 使用中 `1` 归档）。 */
export const wechatOpenidStatusOpts = (t: Translate): UniOption[] => [
  { label: t('attendance.wechatOpenid.activeOption'), value: '0', type: 'success' },
  { label: t('attendance.wechatOpenid.archivedOption'), value: '1', type: 'info' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  schema: [
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('attendance.phSchool'),
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
        placeholder: t('attendance.phAdmissionNo'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'nickname',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.phNickname'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'openId',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('attendance.phOpenId'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'status',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: {
        placeholder: t('attendance.phStatus'),
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
        placeholder: t('attendance.beginTime'),
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
        placeholder: t('attendance.endTime'),
        valueFormat: 'YYYY-MM-DD',
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const tableCols = (
  t: Translate,
  schoolOptions: UniOption[]
): UniTableColumn[] => [
  {
    prop: 'id',
    label: t('attendance.id'),
    type: 'text',
    width: 90,
    fixed: 'left'
  },
  {
    prop: 'schoolId',
    label: t('attendance.campus'),
    type: 'text',
    options: schoolOptions,
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'admissionNo',
    label: t('attendance.admissionNo'),
    type: 'text',
    minWidth: 110,
    showOverflowTooltip: true
  },
  {
    prop: 'nickname',
    label: t('attendance.staffName'),
    type: 'text',
    minWidth: 100,
    showOverflowTooltip: true
  },
  { prop: 'status', label: t('attendance.status'), type: 'text', width: 100 },
  {
    prop: 'encryptedOpenId',
    label: t('attendance.encryptedOpenId'),
    type: 'text',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'updateTime',
    label: t('attendance.updateTime'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'createTime',
    label: t('attendance.createTime'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  }
]

export const detailForm = (
  t: Translate,
  schoolOptions: UniOption[]
): UniFormConfig => ({
  mode: 'view',
  formProps: { labelWidth: '110px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  view: { emptyText: '-' },
  schema: [
    { field: 'id', label: t('attendance.id'), component: 'ElInput' },
    {
      field: 'schoolId',
      label: t('attendance.campus'),
      component: 'ElInput',
      viewType: 'enum',
      options: schoolOptions
    },
    {
      field: 'admissionNo',
      label: t('attendance.admissionNo'),
      component: 'ElInput'
    },
    {
      field: 'nickname',
      label: t('attendance.staffName'),
      component: 'ElInput'
    },
    { field: 'status', label: t('attendance.status'), component: 'ElInput' },
    {
      field: 'encryptedOpenId',
      label: t('attendance.encryptedOpenId'),
      component: 'ElInput'
    },
    {
      field: 'updateTime',
      label: t('attendance.updateTime'),
      component: 'ElInput'
    },
    {
      field: 'createTime',
      label: t('attendance.createTime'),
      component: 'ElInput'
    }
  ]
})
