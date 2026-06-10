import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const leaveDestinationOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.visitRecord.leaveClassroom'), value: 1 },
  { label: t('schoolDoctor.visitRecord.leaveHome'), value: 2 },
  { label: t('schoolDoctor.visitRecord.leaveHospital'), value: 3 }
]

export const yesNoOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.common.yes'), value: 1 },
  { label: t('schoolDoctor.common.no'), value: 0 }
]

export const operateStatusOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.visitRecord.operateNormal'), value: 1 },
  { label: t('schoolDoctor.visitRecord.operateAbnormal'), value: 2 }
]

export const recordSearchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  leaveOptions: UniOption[],
  yesNoOptions: UniOption[],
  defaultSchoolId?: string | number
): UniFormConfig => ({
  rowProps: { gutter: 8 },
  schema: [
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('schoolDoctor.visitRecord.phSchool') },
      defaultValue: defaultSchoolId,
      colProps: { span: 6 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('schoolDoctor.visitRecord.phKeyword') },
      colProps: { span: 6 }
    },
    {
      field: 'leaveDestination',
      label: '',
      component: 'ElSelect',
      options: leaveOptions,
      componentProps: { clearable: true, placeholder: t('schoolDoctor.visitRecord.phLeaveDestination') },
      colProps: { span: 6 }
    },
    {
      field: 'parentAgree',
      label: '',
      component: 'ElSelect',
      options: yesNoOptions,
      componentProps: { clearable: true, placeholder: t('schoolDoctor.visitRecord.phParentAgree') },
      colProps: { span: 6 }
    },
    {
      field: 'contactParent',
      label: '',
      component: 'ElSelect',
      options: yesNoOptions,
      componentProps: { clearable: true, placeholder: t('schoolDoctor.visitRecord.phContactParent') },
      colProps: { span: 6 }
    },
    {
      field: 'visitDateRange',
      label: '',
      component: 'ElDatePicker',
      componentProps: {
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        startPlaceholder: t('schoolDoctor.visitRecord.phVisitDateStart'),
        endPlaceholder: t('schoolDoctor.visitRecord.phVisitDateEnd'),
        style: { width: '100%' }
      },
      colProps: { span: 6 }
    }
  ]
})

export const recordTableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', width: 70, fixed: 'left' },
  { prop: 'schoolName', label: t('schoolDoctor.visitRecord.fieldSchool'), minWidth: 160 },
  { prop: 'admissionNo', label: t('schoolDoctor.visitRecord.fieldAdmissionNo'), minWidth: 120 },
  { prop: 'fullName', label: t('schoolDoctor.visitRecord.fieldName'), minWidth: 120 },
  { prop: 'grade', label: t('schoolDoctor.visitRecord.fieldGrade'), width: 90 },
  { prop: 'formCode', label: t('schoolDoctor.visitRecord.fieldClass'), width: 90 },
  { prop: 'visitDate', label: t('schoolDoctor.visitRecord.fieldVisitDate'), width: 120 },
  { prop: 'visitTimeText', label: t('schoolDoctor.visitRecord.fieldVisitTime'), width: 150 },
  { prop: 'specificSituationText', label: t('schoolDoctor.visitRecord.fieldSituation'), minWidth: 140 },
  { prop: 'leaveDestinationText', label: t('schoolDoctor.visitRecord.fieldLeaveDestination'), width: 100 },
  { prop: 'executeOperationText', label: t('schoolDoctor.visitRecord.fieldExecuteOperation'), width: 120 },
  { prop: 'contactParentText', label: t('schoolDoctor.visitRecord.fieldContactParent'), width: 120 },
  { prop: 'parentSignatureText', label: t('schoolDoctor.visitRecord.fieldParentSignature'), width: 100 },
  { prop: 'createTime', label: t('schoolDoctor.visitRecord.fieldCreateTime'), width: 170 },
  { prop: 'updateTime', label: t('schoolDoctor.visitRecord.fieldUpdateTime'), width: 170 }
]
