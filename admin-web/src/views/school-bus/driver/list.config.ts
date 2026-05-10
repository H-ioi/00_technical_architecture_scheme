import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { DriverFormModel } from '@/types/modules/school-bus-driver'

export const statusOpts = (t: Translate): UniOption[] => [
  { label: t('schoolBus.driver.options.enabled'), value: 1, type: 'success' },
  { label: t('schoolBus.driver.options.disabled'), value: 0, type: 'info' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  schema: [
    {
      field: 'schoolIds',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('schoolBus.driver.placeholders.school'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('schoolBus.driver.placeholders.keyword'),
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
        placeholder: t('schoolBus.driver.placeholders.status'),
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const tableCols = (
  t: Translate,
  schoolOptions: UniOption[],
  statusOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 88, fixed: 'left' },
  {
    prop: 'schoolIds',
    label: t('schoolBus.driver.fields.school'),
    type: 'array',
    options: schoolOptions,
    lookup: { splitValues: true },
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'name',
    label: t('schoolBus.driver.fields.name'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'employeeNo',
    label: t('schoolBus.driver.fields.employeeNo'),
    type: 'text',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'contact',
    label: t('schoolBus.driver.fields.contact'),
    type: 'text',
    width: 130,
    showOverflowTooltip: true
  },
  { prop: 'age', label: t('schoolBus.driver.fields.age'), type: 'text', width: 72 },
  {
    prop: 'licenseType',
    label: t('schoolBus.driver.fields.licenseType'),
    type: 'text',
    width: 110,
    showOverflowTooltip: true
  },
  {
    prop: 'status',
    label: t('schoolBus.driver.fields.status'),
    type: 'tag',
    options: statusOptions,
    width: 96
  }
]

export const formRules = (t: Translate): FormRules<DriverFormModel> => ({
  schoolIds: [
    { required: true, message: t('schoolBus.driver.rules.schoolIds'), trigger: 'change' }
  ],
  name: [{ required: true, message: t('schoolBus.driver.rules.name'), trigger: 'blur' }],
  employeeNo: [
    { required: true, message: t('schoolBus.driver.rules.employeeNo'), trigger: 'blur' }
  ],
  status: [{ required: true, message: t('schoolBus.driver.rules.status'), trigger: 'change' }]
})
