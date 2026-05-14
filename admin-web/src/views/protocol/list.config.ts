import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { ProtocolFormModel } from '@/types/modules/protocol'

import { resolveProtocolDictCellLabel } from './dict-options'

export const yesNoOpts = (t: Translate): UniOption[] => [
  { label: t('protocol.yes'), value: 1, type: 'success' },
  { label: t('protocol.no'), value: 0, type: 'info' }
]

export const statusOpts = (t: Translate): UniOption[] => [
  { label: t('protocol.enabled'), value: 1, type: 'success' },
  { label: t('protocol.disabled'), value: 0, type: 'info' }
]

export const searchForm = (
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
        placeholder: t('protocol.phSchool'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 5 }
    },
    {
      field: 'cnName',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('protocol.phCnName'), clearable: true },
      colProps: { span: 5 }
    },
    {
      field: 'enName',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('protocol.phEnName'), clearable: true },
      colProps: { span: 5 }
    },
    {
      field: 'protocolType',
      label: '',
      component: 'ElSelect',
      options: protocolTypeOptions,
      componentProps: {
        placeholder: t('protocol.phProtocolType'),
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
        placeholder: t('protocol.phModule'),
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
      componentProps: { placeholder: t('protocol.phStatus'), clearable: true },
      colProps: { span: 5 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 5 }
})

export const tableCols = (
  t: Translate,
  locale: string,
  schoolOptions: UniOption[],
  protocolTypeOptions: UniOption[],
  moduleOptions: UniOption[],
  yesNoOptions: UniOption[],
  statusOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 90, fixed: 'left' },
  {
    prop: 'schoolIds',
    label: t('protocol.fieldSchool'),
    type: 'array',
    options: schoolOptions,
    lookup: { splitValues: true },
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'cnName',
    label: t('protocol.fieldCnName'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'enName',
    label: t('protocol.fieldEnName'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'protocolType',
    label: t('protocol.fieldProtocolType'),
    type: 'text',
    minWidth: 130,
    formatter: (row, _column, value) =>
      resolveProtocolDictCellLabel(row, value, protocolTypeOptions, locale, {
        zh: 'protocolTypeCnName',
        en: 'protocolTypeEnName'
      })
  },
  {
    prop: 'module',
    label: t('protocol.fieldModule'),
    type: 'text',
    minWidth: 130,
    formatter: (row, _column, value) =>
      resolveProtocolDictCellLabel(row, value, moduleOptions, locale, {
        zh: 'moduleCnName',
        en: 'moduleEnName'
      })
  },
  {
    prop: 'needSign',
    label: t('protocol.fieldNeedSign'),
    type: 'tag',
    options: yesNoOptions,
    width: 130
  },
  {
    prop: 'status',
    label: t('protocol.fieldStatus'),
    type: 'tag',
    options: statusOptions,
    width: 100
  },
  {
    prop: 'documentUrl',
    label: t('protocol.fieldDocumentUrl'),
    type: 'link',
    minWidth: 180,
    showOverflowTooltip: true
  },
  { prop: 'createTime', label: t('protocol.fieldCreateTime'), type: 'datetime', minWidth: 170 },
  { prop: 'updateTime', label: t('protocol.fieldUpdateTime'), type: 'datetime', minWidth: 170 }
]

export const signCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 90 },
  { prop: 'studentName', label: t('protocol.fieldStudentName'), type: 'text', minWidth: 140 },
  { prop: 'admissionNo', label: t('protocol.fieldAdmissionNo'), type: 'text', minWidth: 130 },
  { prop: 'grade', label: t('protocol.fieldGrade'), type: 'text', minWidth: 110 },
  { prop: 'signImageUrl', label: t('protocol.fieldSignImageUrl'), type: 'link', minWidth: 180 },
  { prop: 'updateTime', label: t('protocol.fieldUpdateTime'), type: 'datetime', minWidth: 170 }
]

export const detailForm = (t: Translate): UniFormConfig => ({
  mode: 'view',
  formProps: { labelWidth: '120px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  view: { emptyText: '-' },
  schema: [
    { field: 'id', label: 'ID', component: 'ElInput' },
    { field: 'schoolName', label: t('protocol.fieldSchool'), component: 'ElInput' },
    { field: 'cnName', label: t('protocol.fieldCnName'), component: 'ElInput' },
    { field: 'enName', label: t('protocol.fieldEnName'), component: 'ElInput' },
    { field: 'protocolTypeName', label: t('protocol.fieldProtocolType'), component: 'ElInput' },
    { field: 'moduleName', label: t('protocol.fieldModule'), component: 'ElInput' },
    { field: 'needSignName', label: t('protocol.fieldNeedSign'), component: 'ElInput' },
    { field: 'statusName', label: t('protocol.fieldStatus'), component: 'ElInput' },
    { field: 'createTime', label: t('protocol.fieldCreateTime'), component: 'ElInput' },
    { field: 'updateTime', label: t('protocol.fieldUpdateTime'), component: 'ElInput' },
    {
      field: 'documentUrl',
      label: t('protocol.fieldDocumentUrl'),
      component: 'ElInput',
      colProps: { span: 24 }
    }
  ]
})

export const formRules = (t: Translate): FormRules<ProtocolFormModel> => ({
  schoolIds: [{ required: true, message: t('protocol.phSchool'), trigger: 'change' }],
  cnName: [{ required: true, message: t('protocol.phCnName'), trigger: 'blur' }],
  enName: [{ required: true, message: t('protocol.phEnName'), trigger: 'blur' }],
  protocolType: [
    { required: true, message: t('protocol.phProtocolType'), trigger: 'change' }
  ],
  module: [{ required: true, message: t('protocol.phModule'), trigger: 'change' }],
  needSign: [{ required: true, message: t('protocol.phNeedSign'), trigger: 'change' }],
  status: [{ required: true, message: t('protocol.phStatus'), trigger: 'change' }],
  documentUrl: [
    { required: true, message: t('protocol.uploadRequired'), trigger: 'change' }
  ]
})

/** 协议新增/编辑弹窗（UniForm + 附件槽位） */
export const protocolDialogFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  protocolTypeOptions: UniOption[],
  moduleOptions: UniOption[],
  yesNoOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  rules: formRules(t) as UniFormConfig['rules'],
  schema: [
    {
      field: 'schoolIds',
      label: t('protocol.fieldSchool'),
      component: 'ElSelect',
      options: schoolOptions,
      colProps: { span: 12 },
      componentProps: {
        multiple: true,
        collapseTags: true,
        filterable: true,
        clearable: true,
        placeholder: t('protocol.phSchool'),
        style: { width: '100%' }
      }
    },
    {
      field: 'cnName',
      label: t('protocol.fieldCnName'),
      component: 'ElInput',
      componentProps: {
        maxlength: 50,
        placeholder: t('protocol.phCnName')
      }
    },
    {
      field: 'enName',
      label: t('protocol.fieldEnName'),
      component: 'ElInput',
      componentProps: {
        maxlength: 50,
        placeholder: t('protocol.phEnName')
      }
    },
    {
      field: 'protocolType',
      label: t('protocol.fieldProtocolType'),
      component: 'ElSelect',
      options: protocolTypeOptions,
      componentProps: {
        filterable: true,
        placeholder: t('protocol.phProtocolType'),
        style: { width: '100%' }
      }
    },
    {
      field: 'module',
      label: t('protocol.fieldModule'),
      component: 'ElSelect',
      options: moduleOptions,
      componentProps: {
        filterable: true,
        placeholder: t('protocol.phModule'),
        style: { width: '100%' }
      }
    },
    {
      field: 'needSign',
      label: t('protocol.fieldNeedSign'),
      component: 'ElSelect',
      options: yesNoOptions,
      componentProps: {
        placeholder: t('protocol.phNeedSign'),
        style: { width: '100%' }
      }
    },
    {
      field: 'status',
      label: t('protocol.fieldStatus'),
      component: 'ElSelect',
      options: statusOptions,
      componentProps: {
        placeholder: t('protocol.phStatus'),
        style: { width: '100%' }
      }
    },
    {
      field: 'documentUrl',
      label: t('protocol.fieldDocumentUrl'),
      component: 'ElInput',
      colProps: { span: 24 },
      formItemProps: { class: 'protocol-dialog-form__doc-slot' }
    }
  ]
})
