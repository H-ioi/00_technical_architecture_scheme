import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export interface DormAddBedFormModel {
  label: string
}

export interface DormCheckinFormModel {
  school?: string | number
  admissionNo?: string
}

export interface DormChangeFormModel {
  school?: string | number
  buildingId?: string | number
  floorId?: string | number
  roomId?: string | number
  bedLabel?: string
}

export const addBedFormConfig = (t: Translate): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  colProps: { span: 24 },
  schema: [
    {
      field: 'label',
      label: t('dorm.roomAssign.fieldBedLabel'),
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('dorm.roomAssign.phBedLabel') },
      colProps: { span: 24 }
    }
  ]
})

export const addBedFormRules = (t: Translate): FormRules => ({
  label: [{ required: true, message: t('dorm.roomAssign.ruleBedLabel'), trigger: 'blur' }]
})

export const checkinFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  studentOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
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
      field: 'admissionNo',
      label: t('dorm.roomAssign.fieldStudent'),
      component: 'ElSelect',
      options: studentOptions,
      componentProps: { filterable: true, placeholder: t('dorm.roomAssign.phStudent') },
      colProps: { span: 24 }
    }
  ]
})

export const checkinFormRules = (t: Translate): FormRules => ({
  school: [{ required: true, message: t('dorm.room.ruleSchool'), trigger: 'change' }],
  admissionNo: [{ required: true, message: t('dorm.roomAssign.ruleStudent'), trigger: 'change' }]
})

export const changeFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  buildingOptions: UniOption[],
  floorOptions: UniOption[],
  roomOptions: UniOption[],
  bedOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
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
      field: 'roomId',
      label: t('dorm.room.fieldNumber'),
      component: 'ElSelect',
      options: roomOptions,
      componentProps: { filterable: true, placeholder: t('dorm.roomAssign.phRoom') },
      colProps: { span: 24 }
    },
    {
      field: 'bedLabel',
      label: t('dorm.roomAssign.fieldBedLabel'),
      component: 'ElSelect',
      options: bedOptions,
      componentProps: { filterable: true, placeholder: t('dorm.roomAssign.phTargetBed') },
      colProps: { span: 24 }
    }
  ]
})

export const changeFormRules = (t: Translate): FormRules => ({
  school: [{ required: true, message: t('dorm.room.ruleSchool'), trigger: 'change' }],
  buildingId: [{ required: true, message: t('dorm.room.ruleBuilding'), trigger: 'change' }],
  floorId: [{ required: true, message: t('dorm.room.ruleFloor'), trigger: 'change' }],
  roomId: [{ required: true, message: t('dorm.roomAssign.ruleRoom'), trigger: 'change' }],
  bedLabel: [{ required: true, message: t('dorm.roomAssign.ruleTargetBed'), trigger: 'change' }]
})

export const emptyAddBedModel = (): DormAddBedFormModel => ({ label: '' })
export const emptyCheckinModel = (): DormCheckinFormModel => ({})
export const emptyChangeModel = (): DormChangeFormModel => ({})
