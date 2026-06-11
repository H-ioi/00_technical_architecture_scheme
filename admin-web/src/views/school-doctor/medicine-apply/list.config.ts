import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type {
  MedicineApplyContentItem,
  MedicineApplyFormModel
} from '@/types/modules/school-doctor-medicine-apply'

export const applyStatusOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.medicineApply.statusPending'), value: 0 },
  { label: t('schoolDoctor.medicineApply.statusWaitingMed'), value: 1 },
  { label: t('schoolDoctor.medicineApply.statusInProgress'), value: 2 },
  { label: t('schoolDoctor.medicineApply.statusRejected'), value: 3 },
  { label: t('schoolDoctor.medicineApply.statusEnded'), value: 4 },
  { label: t('schoolDoctor.medicineApply.statusWithdrawn'), value: 5 }
]

export const applyMedicationFilterOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.common.yes'), value: 1 },
  { label: t('schoolDoctor.common.no'), value: 0 }
]

export const needMedicationOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.medicineApply.needMedicationYes'), value: 1 },
  { label: t('schoolDoctor.medicineApply.needMedicationNo'), value: 0 }
]

export const nurseApprovalOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.medicineApply.nurseApprove'), value: 1 },
  { label: t('schoolDoctor.medicineApply.nurseReject'), value: 2 }
]

export const emptyContentItem = (): MedicineApplyContentItem => ({
  medicineName: '',
  bringQuantity: '',
  dosage: '',
  startDate: '',
  endDate: '',
  administrationTimeType: undefined,
  frequencyType: undefined,
  frequencyOther: '',
  routeType: undefined,
  routeOther: '',
  mealTiming: undefined,
  sideEffects: ''
})

export const emptyFormModel = (): MedicineApplyFormModel => ({
  admissionNo: '',
  fullName: '',
  schoolId: undefined,
  grade: '',
  formCode: '',
  applyMedication: undefined,
  symptomDetails: '',
  informedConsent: 0,
  contentList: [emptyContentItem()],
  diagnosisImageList: [],
  parentName: '',
  parentContact: '',
  parentSignaturePath: '',
  leftoverDisposal: undefined,
  remark: '',
  nurseApproval: undefined,
  nurseOperator: ''
})

export const addFormRules = (t: Translate): FormRules => ({
  applyMedication: [
    {
      required: true,
      message: t('schoolDoctor.medicineApply.ruleNeedMedication'),
      trigger: 'change'
    }
  ],
  informedConsent: [
    {
      validator: (_rule, value, callback) => {
        if (value === 1) {
          callback()
          return
        }
        callback(new Error(t('schoolDoctor.medicineApply.ruleInformedConsent')))
      },
      trigger: 'change'
    }
  ]
})

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  statusOptions: UniOption[],
  applyMedicationOptions: UniOption[],
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
        placeholder: t('schoolDoctor.medicineApply.phSchool')
      },
      defaultValue: defaultSchoolId,
      colProps: { span: 6 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('schoolDoctor.medicineApply.phKeyword') },
      colProps: { span: 6 }
    },
    {
      field: 'applyMedication',
      label: '',
      component: 'ElSelect',
      options: applyMedicationOptions,
      componentProps: {
        clearable: true,
        placeholder: t('schoolDoctor.medicineApply.phApplyMedication')
      },
      colProps: { span: 6 }
    },
    {
      field: 'status',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { clearable: true, placeholder: t('schoolDoctor.medicineApply.phStatus') },
      colProps: { span: 6 }
    }
  ]
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', width: 70, fixed: 'left' },
  { prop: 'schoolName', label: t('schoolDoctor.medicineApply.fieldSchool'), minWidth: 160 },
  { prop: 'admissionNo', label: t('schoolDoctor.medicineApply.fieldAdmissionNo'), minWidth: 120 },
  { prop: 'fullName', label: t('schoolDoctor.medicineApply.fieldName'), minWidth: 120 },
  { prop: 'grade', label: t('schoolDoctor.medicineApply.fieldGrade'), width: 90 },
  { prop: 'formCode', label: t('schoolDoctor.medicineApply.fieldClass'), width: 90 },
  {
    prop: 'applyMedicationText',
    label: t('schoolDoctor.medicineApply.fieldApplyMedication'),
    width: 100
  },
  { prop: 'statusText', label: t('schoolDoctor.medicineApply.fieldStatus'), width: 110 },
  { prop: 'applicantText', label: t('schoolDoctor.medicineApply.fieldApplicant'), minWidth: 120 },
  { prop: 'createTime', label: t('schoolDoctor.medicineApply.fieldCreateTime'), width: 170 },
  { prop: 'updateTime', label: t('schoolDoctor.medicineApply.fieldUpdateTime'), width: 170 }
]
