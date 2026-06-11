import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { HealthReportFormModel } from '@/types/modules/school-doctor-health-report'

export const reportTypeOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.healthReport.typeEntry'), value: 1 },
  { label: t('schoolDoctor.healthReport.typeAnnual'), value: 2 }
]

export const searchForm = (t: Translate, typeOptions: UniOption[]): UniFormConfig => ({
  rowProps: { gutter: 8 },
  schema: [
    {
      field: 'reportType',
      label: '',
      component: 'ElSelect',
      options: typeOptions,
      componentProps: { clearable: true, placeholder: t('schoolDoctor.healthReport.phReportType') },
      colProps: { span: 6 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('schoolDoctor.healthReport.phKeyword') },
      colProps: { span: 6 }
    }
  ]
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', width: 70, fixed: 'left' },
  { prop: 'schoolName', label: t('schoolDoctor.healthReport.fieldSchool'), minWidth: 250 },
  { prop: 'admissionNo', label: t('schoolDoctor.healthReport.fieldAdmissionNo'), minWidth: 120 },
  { prop: 'studentName', label: t('schoolDoctor.healthReport.fieldName'), width: 120 },
  { prop: 'gradeName', label: t('schoolDoctor.healthReport.fieldGrade'), width: 120 },
  { prop: 'className', label: t('schoolDoctor.healthReport.fieldClass'), width: 120 },
  { prop: 'reportTypeText', label: t('schoolDoctor.healthReport.fieldReportType'), width: 120 },
  { prop: 'examYear', label: t('schoolDoctor.healthReport.fieldExamYear'), width: 120 },
  { prop: 'examDate', label: t('schoolDoctor.healthReport.fieldExamDate'), width: 170 },
  { prop: 'examOrg', label: t('schoolDoctor.healthReport.fieldExamOrg'), width: 150 },
  { prop: 'createTime', label: t('schoolDoctor.healthReport.fieldCreateTime'), width: 170 },
  { prop: 'updateTime', label: t('schoolDoctor.healthReport.fieldUpdateTime'), width: 170 }
]

export const emptyFormModel = (): HealthReportFormModel => ({
  admissionNo: '',
  studentName: '',
  schoolId: undefined,
  gradeName: '',
  className: '',
  formCode: '',
  reportType: undefined,
  examYear: '',
  examDate: '',
  examOrg: '',
  remark: '',
  attachmentList: []
})

export const formRules = (t: Translate): FormRules => ({
  admissionNo: [
    { required: true, message: t('schoolDoctor.healthReport.ruleAdmissionNo'), trigger: 'blur' }
  ],
  studentName: [
    { required: true, message: t('schoolDoctor.healthReport.ruleStudentName'), trigger: 'blur' }
  ],
  schoolId: [
    { required: true, message: t('schoolDoctor.healthReport.ruleSchool'), trigger: 'change' }
  ],
  reportType: [
    { required: true, message: t('schoolDoctor.healthReport.ruleReportType'), trigger: 'change' }
  ],
  examYear: [
    { required: true, message: t('schoolDoctor.healthReport.ruleExamYear'), trigger: 'change' }
  ],
  examDate: [
    { required: true, message: t('schoolDoctor.healthReport.ruleExamDate'), trigger: 'change' }
  ]
})
