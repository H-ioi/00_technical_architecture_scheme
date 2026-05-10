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
  statusOptions: UniOption[],
  /** 单校区时重置查询可回到该校（与旧系统一致） */
  defaultSchoolId?: string | number | null
): UniFormConfig => ({
  schema: [
    {
      field: 'schoolIds',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      ...(defaultSchoolId != null ? { defaultValue: defaultSchoolId } : {}),
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
  contact: [
    { required: true, message: t('schoolBus.driver.rules.contact'), trigger: 'blur' }
  ],
  age: [
    { required: true, message: t('schoolBus.driver.rules.age'), trigger: 'change' },
    {
      type: 'number',
      min: 18,
      max: 80,
      message: t('schoolBus.driver.rules.ageRange'),
      trigger: 'change'
    }
  ],
  licenseType: [
    { required: true, message: t('schoolBus.driver.rules.licenseType'), trigger: 'blur' }
  ],
  status: [{ required: true, message: t('schoolBus.driver.rules.status'), trigger: 'change' }]
})

/** 司机新增/编辑/查看弹窗（与 `base/components/dict.vue` 一致使用 `UniForm`） */
export const driverDialogFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  rules: formRules(t) as UniFormConfig['rules'],
  schema: [
    {
      field: 'schoolIds',
      label: t('schoolBus.driver.fields.school'),
      component: 'ElSelect',
      options: schoolOptions,
      colProps: { span: 24 },
      componentProps: {
        multiple: true,
        collapseTags: true,
        filterable: true,
        clearable: true,
        placeholder: t('schoolBus.driver.placeholders.school')
      },
      viewRender: ({ value }) => {
        const ids = Array.isArray(value) ? value : []
        if (!ids.length) {
          return '--'
        }

        return ids
          .map(
            (id) =>
              schoolOptions.find((o) => String(o.value) === String(id))?.label ?? String(id)
          )
          .join('、')
      }
    },
    {
      field: 'name',
      label: t('schoolBus.driver.fields.name'),
      component: 'ElInput',
      componentProps: {
        maxlength: 64,
        clearable: true,
        placeholder: t('schoolBus.driver.placeholders.name')
      }
    },
    {
      field: 'employeeNo',
      label: t('schoolBus.driver.fields.employeeNo'),
      component: 'ElInput',
      componentProps: {
        maxlength: 64,
        clearable: true,
        placeholder: t('schoolBus.driver.placeholders.employeeNo')
      }
    },
    {
      field: 'contact',
      label: t('schoolBus.driver.fields.contact'),
      component: 'ElInput',
      componentProps: {
        maxlength: 32,
        clearable: true,
        placeholder: t('schoolBus.driver.placeholders.contact')
      }
    },
    {
      field: 'age',
      label: t('schoolBus.driver.fields.age'),
      component: 'ElInputNumber',
      componentProps: {
        min: 18,
        max: 80,
        step: 1,
        precision: 0,
        controlsPosition: 'right',
        style: { width: '100%' }
      }
    },
    {
      field: 'licenseType',
      label: t('schoolBus.driver.fields.licenseType'),
      component: 'ElInput',
      componentProps: {
        maxlength: 32,
        clearable: true,
        placeholder: t('schoolBus.driver.placeholders.licenseType')
      }
    },
    {
      field: 'status',
      label: t('schoolBus.driver.fields.status'),
      component: 'ElSelect',
      options: statusOptions,
      viewType: 'enum',
      componentProps: {
        placeholder: t('schoolBus.driver.placeholders.status')
      }
    }
  ]
})
