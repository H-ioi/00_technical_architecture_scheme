import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniFormField } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { DormBuildingFormModel } from '@/types/modules/dorm-building'

export const activeFilterOpts = (t: Translate): UniOption[] => [
  { label: t('dorm.building.statusActive'), value: '1' },
  { label: t('dorm.building.statusInactive'), value: '0' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  buildingOptions: UniOption[],
  activeOptions: UniOption[],
  defaultSchoolId?: string | number
): UniFormConfig => ({
  rowProps: { gutter: 8 },
  schema: [
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.building.phSchool') },
      defaultValue: defaultSchoolId,
      colProps: { span: 6 }
    },
    {
      field: 'buildingId',
      label: '',
      component: 'ElSelect',
      options: buildingOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.building.phBuilding') },
      colProps: { span: 6 }
    },
    {
      field: 'isActive',
      label: '',
      component: 'ElSelect',
      options: activeOptions,
      componentProps: { clearable: true, placeholder: t('dorm.building.phStatus') },
      colProps: { span: 6 }
    }
  ] as UniFormField[]
})

export const dialogFormConfig = (t: Translate, schoolOptions: UniOption[]): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 20 },
  colProps: { span: 24 },
  schema: [
    {
      field: 'schoolId',
      label: t('dorm.building.fieldSchool'),
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { filterable: true, placeholder: t('dorm.building.phSchool') },
      colProps: { span: 24 }
    },
    {
      field: 'name',
      label: t('dorm.building.fieldName'),
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('dorm.building.phName') },
      colProps: { span: 24 }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  schoolId: [{ required: true, message: t('dorm.building.ruleSchool'), trigger: 'change' }],
  name: [{ required: true, message: t('dorm.building.ruleName'), trigger: 'blur' }]
})

export const emptyFormModel = (): DormBuildingFormModel => ({
  name: ''
})
