import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { ProtocolFormModel } from '@/types/modules/protocol'

export const createYesNoOptions = (t: Translate): UniOption[] => [
  { label: t('protocol.options.yes'), value: 1, type: 'success' },
  { label: t('protocol.options.no'), value: 0, type: 'info' }
]

export const createStatusOptions = (t: Translate): UniOption[] => [
  { label: t('protocol.options.enabled'), value: 1, type: 'success' },
  { label: t('protocol.options.disabled'), value: 0, type: 'info' }
]

export const createSearchConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  protocolTypeOptions: UniOption[],
  moduleOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  schema: [
    {
      field: 'schoolIds',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('protocol.placeholders.school'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 5 }
    },
    {
      field: 'cnName',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('protocol.placeholders.cnName'), clearable: true },
      colProps: { span: 5 }
    },
    {
      field: 'enName',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('protocol.placeholders.enName'), clearable: true },
      colProps: { span: 5 }
    },
    {
      field: 'protocolType',
      label: '',
      component: 'ElSelect',
      options: protocolTypeOptions,
      componentProps: {
        placeholder: t('protocol.placeholders.protocolType'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 5 }
    },
    {
      field: 'module',
      label: '',
      component: 'ElSelect',
      options: moduleOptions,
      componentProps: {
        placeholder: t('protocol.placeholders.module'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 4 }
    },
    {
      field: 'status',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { placeholder: t('protocol.placeholders.status'), clearable: true },
      colProps: { span: 5 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 5 }
})

export const createColumns = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 90, fixed: 'left' },
  {
    prop: 'schoolName',
    label: t('protocol.fields.school'),
    type: 'text',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'cnName',
    label: t('protocol.fields.cnName'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'enName',
    label: t('protocol.fields.enName'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  { prop: 'protocolType', label: t('protocol.fields.protocolType'), type: 'enum', minWidth: 130 },
  { prop: 'module', label: t('protocol.fields.module'), type: 'enum', minWidth: 130 },
  { prop: 'needSign', label: t('protocol.fields.needSign'), type: 'tag', width: 130 },
  { prop: 'status', label: t('protocol.fields.status'), type: 'tag', width: 100 },
  {
    prop: 'documentUrl',
    label: t('protocol.fields.documentUrl'),
    type: 'link',
    minWidth: 180,
    showOverflowTooltip: true
  },
  { prop: 'createTime', label: t('protocol.fields.createTime'), type: 'datetime', minWidth: 170 },
  { prop: 'updateTime', label: t('protocol.fields.updateTime'), type: 'datetime', minWidth: 170 }
]

export const createSignColumns = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 90 },
  { prop: 'studentName', label: t('protocol.fields.studentName'), type: 'text', minWidth: 140 },
  { prop: 'admissionNo', label: t('protocol.fields.admissionNo'), type: 'text', minWidth: 130 },
  { prop: 'grade', label: t('protocol.fields.grade'), type: 'text', minWidth: 110 },
  { prop: 'signImageUrl', label: t('protocol.fields.signImageUrl'), type: 'link', minWidth: 180 },
  { prop: 'updateTime', label: t('protocol.fields.updateTime'), type: 'datetime', minWidth: 170 }
]

export const createDetailConfig = (t: Translate): UniFormConfig => ({
  mode: 'view',
  formProps: { labelWidth: '120px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  view: { emptyText: '-' },
  schema: [
    { field: 'id', label: 'ID', component: 'ElInput' },
    { field: 'schoolName', label: t('protocol.fields.school'), component: 'ElInput' },
    { field: 'cnName', label: t('protocol.fields.cnName'), component: 'ElInput' },
    { field: 'enName', label: t('protocol.fields.enName'), component: 'ElInput' },
    { field: 'protocolTypeName', label: t('protocol.fields.protocolType'), component: 'ElInput' },
    { field: 'moduleName', label: t('protocol.fields.module'), component: 'ElInput' },
    { field: 'needSignName', label: t('protocol.fields.needSign'), component: 'ElInput' },
    { field: 'statusName', label: t('protocol.fields.status'), component: 'ElInput' },
    { field: 'createTime', label: t('protocol.fields.createTime'), component: 'ElInput' },
    { field: 'updateTime', label: t('protocol.fields.updateTime'), component: 'ElInput' },
    { field: 'documentUrl', label: t('protocol.fields.documentUrl'), component: 'ElInput', colProps: { span: 24 } }
  ]
})

export const createFormRules = (t: Translate): FormRules<ProtocolFormModel> => ({
  schoolIds: [{ required: true, message: t('protocol.placeholders.school'), trigger: 'change' }],
  cnName: [{ required: true, message: t('protocol.placeholders.cnName'), trigger: 'blur' }],
  enName: [{ required: true, message: t('protocol.placeholders.enName'), trigger: 'blur' }],
  protocolType: [{ required: true, message: t('protocol.placeholders.protocolType'), trigger: 'change' }],
  module: [{ required: true, message: t('protocol.placeholders.module'), trigger: 'change' }],
  needSign: [{ required: true, message: t('protocol.placeholders.needSign'), trigger: 'change' }],
  status: [{ required: true, message: t('protocol.placeholders.status'), trigger: 'change' }],
  documentUrl: [{ required: true, message: t('protocol.messages.uploadRequired'), trigger: 'change' }]
})
