import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { DormFloorFormModel } from '@/types/modules/dorm-floor'

import { activeFilterOpts } from '../building/list.config'

export { activeFilterOpts }

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
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.floor.phSchool') },
      defaultValue: defaultSchoolId,
      colProps: { span: 6 }
    },
    {
      field: 'buildingId',
      label: '',
      component: 'ElSelect',
      options: buildingOptions,
      componentProps: {
        clearable: true,
        filterable: true,
        placeholder: t('dorm.floor.phBuilding')
      },
      colProps: { span: 6 }
    },
    {
      field: 'floorIsActive',
      label: '',
      component: 'ElSelect',
      options: activeOptions,
      componentProps: { clearable: true, placeholder: t('dorm.floor.phStatus') },
      colProps: { span: 6 }
    }
  ]
})

export const dialogFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  buildingOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 20 },
  colProps: { span: 24 },
  schema: [
    {
      field: 'school',
      label: t('dorm.floor.fieldSchool'),
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { filterable: true, placeholder: t('dorm.floor.phSchool') },
      colProps: { span: 24 }
    },
    {
      field: 'buildingId',
      label: t('dorm.floor.fieldBuilding'),
      component: 'ElSelect',
      options: buildingOptions,
      componentProps: { filterable: true, placeholder: t('dorm.floor.phBuilding') },
      colProps: { span: 24 }
    },
    {
      field: 'name',
      label: t('dorm.floor.fieldName'),
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('dorm.floor.phName') },
      colProps: { span: 24 }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  school: [{ required: true, message: t('dorm.floor.ruleSchool'), trigger: 'change' }],
  buildingId: [{ required: true, message: t('dorm.floor.ruleBuilding'), trigger: 'change' }],
  name: [{ required: true, message: t('dorm.floor.ruleName'), trigger: 'blur' }]
})

export const emptyFormModel = (): DormFloorFormModel => ({
  name: ''
})
