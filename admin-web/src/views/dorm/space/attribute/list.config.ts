import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { DormProjectFormModel } from '@/types/modules/dorm-project'

export const activeStatusOpts = (t: Translate): UniOption[] => [
  { label: t('dorm.building.statusActive'), value: '1' },
  { label: t('dorm.building.statusInactive'), value: '0' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  defaultSchoolId?: string | number
): UniFormConfig => ({
  rowProps: { gutter: 8 },
  schema: [
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        clearable: true,
        filterable: true,
        placeholder: t('dorm.attribute.phSchool')
      },
      defaultValue: defaultSchoolId,
      colProps: { span: 6 }
    }
  ]
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  {
    prop: 'schoolName',
    label: t('dorm.attribute.fieldSchool'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'name',
    label: t('dorm.attribute.fieldName'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'statusLabel',
    label: t('dorm.attribute.fieldStatus'),
    type: 'text',
    width: 100,
    align: 'center'
  },
  {
    prop: 'creatorName',
    label: t('dorm.attribute.fieldCreator'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  }
]

export const dialogFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 20 },
  colProps: { span: 24 },
  schema: [
    {
      field: 'schoolId',
      label: t('dorm.attribute.fieldSchool'),
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { filterable: true, placeholder: t('dorm.attribute.phSchool') },
      colProps: { span: 24 }
    },
    {
      field: 'name',
      label: t('dorm.attribute.fieldName'),
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('dorm.attribute.phName') },
      colProps: { span: 24 }
    },
    {
      field: 'isActive',
      label: t('dorm.attribute.fieldStatus'),
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { placeholder: t('dorm.attribute.phStatus') },
      colProps: { span: 24 }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  schoolId: [{ required: true, message: t('dorm.attribute.ruleSchool'), trigger: 'change' }],
  name: [{ required: true, message: t('dorm.attribute.ruleName'), trigger: 'blur' }],
  isActive: [{ required: true, message: t('dorm.attribute.ruleStatus'), trigger: 'change' }]
})

export const emptyFormModel = (): DormProjectFormModel => ({
  name: '',
  isActive: '1'
})
