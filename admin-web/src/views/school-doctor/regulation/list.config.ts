import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { SchoolDoctorRegulationFormModel } from '@/types/modules/school-doctor-regulation'

export const typeOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.regulation.typeRule'), value: 1 },
  { label: t('schoolDoctor.regulation.typeConsent'), value: 2 },
  { label: t('schoolDoctor.regulation.typeAuthorization'), value: 3 }
]

export const statusOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.regulation.statusEnabled'), value: 1 },
  { label: t('schoolDoctor.regulation.statusDisabled'), value: 0 }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  typeOptions: UniOption[],
  statusOptions: UniOption[],
  defaultSchoolId?: string | number
): UniFormConfig => ({
  rowProps: { gutter: 8 },
  schema: [
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('schoolDoctor.regulation.phSchool') },
      defaultValue: defaultSchoolId,
      colProps: { span: 6 }
    },
    {
      field: 'type',
      label: '',
      component: 'ElSelect',
      options: typeOptions,
      componentProps: { clearable: true, placeholder: t('schoolDoctor.regulation.phType') },
      colProps: { span: 6 }
    },
    {
      field: 'status',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { clearable: true, placeholder: t('schoolDoctor.regulation.phStatus') },
      colProps: { span: 6 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('schoolDoctor.regulation.phKeyword') },
      colProps: { span: 6 }
    }
  ]
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', width: 70, fixed: 'left' },
  { prop: 'schoolName', label: t('schoolDoctor.regulation.fieldSchool'), minWidth: 160 },
  { prop: 'fileName', label: t('schoolDoctor.regulation.fieldFileName'), minWidth: 180 },
  { prop: 'typeText', label: t('schoolDoctor.regulation.fieldType'), width: 120 },
  { prop: 'statusText', label: t('schoolDoctor.regulation.fieldStatus'), width: 100 },
  { prop: 'creator', label: t('schoolDoctor.regulation.fieldCreator'), minWidth: 100 },
  { prop: 'createTime', label: t('schoolDoctor.regulation.fieldCreateTime'), width: 170 },
  { prop: 'updateTime', label: t('schoolDoctor.regulation.fieldUpdateTime'), width: 170 }
]

export const emptyFormModel = (): SchoolDoctorRegulationFormModel => ({
  cnTitle: '',
  enTitle: '',
  cnIntro: '',
  enIntro: '',
  type: undefined,
  status: 1,
  remark: '',
  attachmentUrl: '',
  attachmentName: ''
})

export const dialogFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  typeOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 16 },
  schema: [
    {
      field: 'schoolId',
      label: t('schoolDoctor.regulation.fieldSchool'),
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('schoolDoctor.regulation.phSchoolSelect') },
      colProps: { span: 24 }
    },
    {
      field: 'cnTitle',
      label: t('schoolDoctor.regulation.fieldCnTitle'),
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('schoolDoctor.regulation.phCnTitle') },
      colProps: { span: 24 }
    },
    {
      field: 'enTitle',
      label: t('schoolDoctor.regulation.fieldEnTitle'),
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('schoolDoctor.regulation.phEnTitle') },
      colProps: { span: 24 }
    },
    {
      field: 'cnIntro',
      label: t('schoolDoctor.regulation.fieldCnIntro'),
      component: 'ElInput',
      componentProps: { type: 'textarea', rows: 3, placeholder: t('schoolDoctor.regulation.phRemark') },
      colProps: { span: 24 }
    },
    {
      field: 'enIntro',
      label: t('schoolDoctor.regulation.fieldEnIntro'),
      component: 'ElInput',
      componentProps: { type: 'textarea', rows: 3, placeholder: t('schoolDoctor.regulation.phRemark') },
      colProps: { span: 24 }
    },
    {
      field: 'type',
      label: t('schoolDoctor.regulation.fieldType'),
      component: 'ElSelect',
      options: typeOptions,
      componentProps: { clearable: true, placeholder: t('schoolDoctor.regulation.phTypeSelect') },
      colProps: { span: 12 }
    },
    {
      field: 'status',
      label: t('schoolDoctor.regulation.fieldStatus'),
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { clearable: true, placeholder: t('schoolDoctor.regulation.phStatusSelect') },
      colProps: { span: 12 }
    },
    {
      field: 'remark',
      label: t('schoolDoctor.regulation.fieldRemark'),
      component: 'ElInput',
      componentProps: { type: 'textarea', rows: 3, placeholder: t('schoolDoctor.regulation.phRemark') },
      colProps: { span: 24 }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  schoolId: [{ required: true, message: t('schoolDoctor.regulation.ruleSchool'), trigger: 'change' }],
  cnTitle: [{ required: true, message: t('schoolDoctor.regulation.ruleCnTitle'), trigger: 'blur' }],
  enTitle: [{ required: true, message: t('schoolDoctor.regulation.ruleEnTitle'), trigger: 'blur' }],
  type: [{ required: true, message: t('schoolDoctor.regulation.ruleType'), trigger: 'change' }],
  status: [{ required: true, message: t('schoolDoctor.regulation.ruleStatus'), trigger: 'change' }]
})
