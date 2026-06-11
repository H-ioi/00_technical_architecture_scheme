import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { SchoolDoctorDiseaseSettingFormModel } from '@/types/modules/school-doctor-disease-setting'

export const typeOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.diseaseSetting.typeDisease'), value: 1 },
  { label: t('schoolDoctor.diseaseSetting.typeSymptom'), value: 2 }
]

export const statusOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.diseaseSetting.statusEnabled'), value: 1 },
  { label: t('schoolDoctor.diseaseSetting.statusDisabled'), value: 0 }
]

export const searchForm = (
  t: Translate,
  typeOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  rowProps: { gutter: 8 },
  schema: [
    {
      field: 'type',
      label: '',
      component: 'ElSelect',
      options: typeOptions,
      componentProps: { clearable: true, placeholder: t('schoolDoctor.diseaseSetting.phType') },
      colProps: { span: 6 }
    },
    {
      field: 'status',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { clearable: true, placeholder: t('schoolDoctor.diseaseSetting.phStatus') },
      colProps: { span: 6 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('schoolDoctor.diseaseSetting.phKeyword') },
      colProps: { span: 6 }
    }
  ]
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', width: 70, fixed: 'left' },
  { prop: 'cnName', label: t('schoolDoctor.diseaseSetting.fieldCnName'), minWidth: 120 },
  { prop: 'enName', label: t('schoolDoctor.diseaseSetting.fieldEnName'), minWidth: 140 },
  { prop: 'typeText', label: t('schoolDoctor.diseaseSetting.fieldType'), width: 100 },
  { prop: 'statusText', label: t('schoolDoctor.diseaseSetting.fieldStatus'), width: 100 },
  { prop: 'creator', label: t('schoolDoctor.diseaseSetting.fieldCreator'), minWidth: 100 },
  { prop: 'createTime', label: t('schoolDoctor.diseaseSetting.fieldCreateTime'), width: 170 },
  { prop: 'updateTime', label: t('schoolDoctor.diseaseSetting.fieldUpdateTime'), width: 170 }
]

export const emptyFormModel = (): SchoolDoctorDiseaseSettingFormModel => ({
  cnName: '',
  enName: '',
  type: undefined,
  status: 1,
  remark: ''
})

export const dialogFormConfig = (
  t: Translate,
  typeOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 16 },
  schema: [
    {
      field: 'cnName',
      label: t('schoolDoctor.diseaseSetting.fieldCnName'),
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('schoolDoctor.diseaseSetting.phCnName') },
      colProps: { span: 24 }
    },
    {
      field: 'enName',
      label: t('schoolDoctor.diseaseSetting.fieldEnName'),
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('schoolDoctor.diseaseSetting.phEnName') },
      colProps: { span: 24 }
    },
    {
      field: 'type',
      label: t('schoolDoctor.diseaseSetting.fieldType'),
      component: 'ElSelect',
      options: typeOptions,
      componentProps: {
        clearable: true,
        placeholder: t('schoolDoctor.diseaseSetting.phTypeSelect')
      },
      colProps: { span: 12 }
    },
    {
      field: 'status',
      label: t('schoolDoctor.diseaseSetting.fieldStatus'),
      component: 'ElSelect',
      options: statusOptions,
      componentProps: {
        clearable: true,
        placeholder: t('schoolDoctor.diseaseSetting.phStatusSelect')
      },
      colProps: { span: 12 }
    },
    {
      field: 'remark',
      label: t('schoolDoctor.diseaseSetting.fieldRemark'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: t('schoolDoctor.diseaseSetting.phRemark')
      },
      colProps: { span: 24 }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  cnName: [
    { required: true, message: t('schoolDoctor.diseaseSetting.ruleCnName'), trigger: 'blur' }
  ],
  enName: [
    { required: true, message: t('schoolDoctor.diseaseSetting.ruleEnName'), trigger: 'blur' }
  ],
  type: [{ required: true, message: t('schoolDoctor.diseaseSetting.ruleType'), trigger: 'change' }],
  status: [
    { required: true, message: t('schoolDoctor.diseaseSetting.ruleStatus'), trigger: 'change' }
  ]
})
