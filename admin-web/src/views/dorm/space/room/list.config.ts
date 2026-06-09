import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { DormRoomFormModel } from '@/types/modules/dorm-room'

export const genderFilterOpts = (t: Translate): UniOption[] => [
  { label: t('dorm.room.genderMale'), value: '1' },
  { label: t('dorm.room.genderFemale'), value: '2' }
]

export const genderFormOpts = (t: Translate): UniOption[] => [
  { label: t('dorm.room.genderMale'), value: '1' },
  { label: t('dorm.room.genderFemale'), value: '2' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  buildingOptions: UniOption[],
  floorOptions: UniOption[],
  genderOptions: UniOption[],
  defaultSchoolId?: string | number
): UniFormConfig => ({
  rowProps: { gutter: 8 },
  schema: [
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.room.phSchool') },
      defaultValue: defaultSchoolId,
      colProps: { span: 4 }
    },
    {
      field: 'buildingId',
      label: '',
      component: 'ElSelect',
      options: buildingOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.room.phBuilding') },
      colProps: { span: 4 }
    },
    {
      field: 'floorId',
      label: '',
      component: 'ElSelect',
      options: floorOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.room.phFloor') },
      colProps: { span: 4 }
    },
    {
      field: 'roomGender',
      label: '',
      component: 'ElSelect',
      options: genderOptions,
      componentProps: { clearable: true, placeholder: t('dorm.room.phGender') },
      colProps: { span: 4 }
    },
    {
      field: 'studentNameKeyword',
      label: '',
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('dorm.room.phStudentName') },
      colProps: { span: 4 }
    },
    {
      field: 'roomNumberKeyword',
      label: '',
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('dorm.room.phRoomNumber') },
      colProps: { span: 4 }
    }
  ]
})

export const dialogFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  buildingOptions: UniOption[],
  floorOptions: UniOption[],
  projectOptions: UniOption[],
  genderOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 20 },
  colProps: { span: 24 },
  schema: [
    {
      field: 'school',
      label: t('dorm.room.fieldSchool'),
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { filterable: true, placeholder: t('dorm.room.phSchool') },
      colProps: { span: 24 }
    },
    {
      field: 'gender',
      label: t('dorm.room.fieldGender'),
      component: 'ElSelect',
      options: genderOptions,
      componentProps: { placeholder: t('dorm.room.phGender') },
      colProps: { span: 24 }
    },
    {
      field: 'buildingId',
      label: t('dorm.room.fieldBuilding'),
      component: 'ElSelect',
      options: buildingOptions,
      componentProps: { filterable: true, placeholder: t('dorm.room.phBuilding') },
      colProps: { span: 24 }
    },
    {
      field: 'floorId',
      label: t('dorm.room.fieldFloor'),
      component: 'ElSelect',
      options: floorOptions,
      componentProps: { filterable: true, placeholder: t('dorm.room.phFloor') },
      colProps: { span: 24 }
    },
    {
      field: 'projectId',
      label: t('dorm.room.fieldProject'),
      component: 'ElSelect',
      options: projectOptions,
      componentProps: { filterable: true, placeholder: t('dorm.room.phProject') },
      colProps: { span: 24 }
    },
    {
      field: 'number',
      label: t('dorm.room.fieldNumber'),
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('dorm.room.phNumber') },
      colProps: { span: 24 }
    },
    {
      field: 'total_bed_count',
      label: t('dorm.room.fieldBedCount'),
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('dorm.room.phBedCount') },
      colProps: { span: 24 }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  school: [{ required: true, message: t('dorm.room.ruleSchool'), trigger: 'change' }],
  gender: [{ required: true, message: t('dorm.room.ruleGender'), trigger: 'change' }],
  buildingId: [{ required: true, message: t('dorm.room.ruleBuilding'), trigger: 'change' }],
  floorId: [{ required: true, message: t('dorm.room.ruleFloor'), trigger: 'change' }],
  projectId: [{ required: true, message: t('dorm.room.ruleProject'), trigger: 'change' }],
  number: [{ required: true, message: t('dorm.room.ruleNumber'), trigger: 'blur' }],
  total_bed_count: [{ required: true, message: t('dorm.room.ruleBedCount'), trigger: 'blur' }]
})

export const emptyFormModel = (): DormRoomFormModel => ({
  number: '',
  total_bed_count: ''
})
