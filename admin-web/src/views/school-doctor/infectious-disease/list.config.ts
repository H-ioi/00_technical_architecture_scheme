import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { InfectiousDiseaseFormModel } from '@/types/modules/school-doctor-infectious-disease'

export const statusOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.infectiousDisease.statusRecovered'), value: 1 },
  { label: t('schoolDoctor.infectiousDisease.statusSickLeave'), value: 2 }
]

export const searchForm = (t: Translate, statusOptions: UniOption[]): UniFormConfig => ({
  rowProps: { gutter: 8 },
  schema: [
    {
      field: 'status',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { clearable: true, placeholder: t('schoolDoctor.infectiousDisease.phStatus') },
      colProps: { span: 6 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('schoolDoctor.infectiousDisease.phKeyword') },
      colProps: { span: 6 }
    },
    {
      field: 'discoveryDateRange',
      label: '',
      component: 'ElDatePicker',
      componentProps: {
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        startPlaceholder: t('schoolDoctor.infectiousDisease.phDiscoveryStart'),
        endPlaceholder: t('schoolDoctor.infectiousDisease.phDiscoveryEnd'),
        style: { width: '100%' }
      },
      colProps: { span: 8 }
    }
  ]
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', width: 70, fixed: 'left' },
  { prop: 'schoolName', label: t('schoolDoctor.infectiousDisease.fieldSchool'), minWidth: 200 },
  { prop: 'admissionNo', label: t('schoolDoctor.infectiousDisease.fieldAdmissionNo'), minWidth: 120 },
  { prop: 'fullName', label: t('schoolDoctor.infectiousDisease.fieldName'), minWidth: 140 },
  { prop: 'grade', label: t('schoolDoctor.infectiousDisease.fieldGrade'), width: 100 },
  { prop: 'formCode', label: t('schoolDoctor.infectiousDisease.fieldClass'), width: 100 },
  { prop: 'diseaseName', label: t('schoolDoctor.infectiousDisease.fieldDiseaseName'), width: 120 },
  { prop: 'discoveryDate', label: t('schoolDoctor.infectiousDisease.fieldDiscoveryDate'), width: 170 },
  { prop: 'statusText', label: t('schoolDoctor.infectiousDisease.fieldStatus'), width: 100 },
  { prop: 'createTime', label: t('schoolDoctor.infectiousDisease.fieldCreateTime'), width: 170 },
  { prop: 'updateTime', label: t('schoolDoctor.infectiousDisease.fieldUpdateTime'), width: 170 }
]

export const emptyFormModel = (): InfectiousDiseaseFormModel => ({
  admissionNo: '',
  studentName: '',
  schoolId: undefined,
  gradeName: '',
  className: '',
  diseaseName: '',
  discoveryDate: '',
  status: undefined,
  remark: '',
  attachmentList: []
})

export const formRules = (t: Translate): FormRules => ({
  admissionNo: [{ required: true, message: t('schoolDoctor.infectiousDisease.ruleAdmissionNo'), trigger: 'blur' }],
  studentName: [{ required: true, message: t('schoolDoctor.infectiousDisease.ruleStudentName'), trigger: 'blur' }],
  schoolId: [{ required: true, message: t('schoolDoctor.infectiousDisease.ruleSchool'), trigger: 'change' }],
  diseaseName: [{ required: true, message: t('schoolDoctor.infectiousDisease.ruleDiseaseName'), trigger: 'blur' }],
  discoveryDate: [{ required: true, message: t('schoolDoctor.infectiousDisease.ruleDiscoveryDate'), trigger: 'change' }],
  status: [{ required: true, message: t('schoolDoctor.infectiousDisease.ruleStatus'), trigger: 'change' }]
})
