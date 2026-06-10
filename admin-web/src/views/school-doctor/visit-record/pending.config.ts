import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const pendingSearchStatusOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.visitRecord.pendingStatusWaiting'), value: 'waiting' },
  { label: t('schoolDoctor.visitRecord.pendingStatusInProgress'), value: 'inProgress' },
  { label: t('schoolDoctor.visitRecord.pendingStatusEnded'), value: 'ended' }
]

export const pendingSearchForm = (
  t: Translate,
  schoolOptions: UniOption[],
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
      field: 'searchStatus',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { clearable: true, placeholder: t('schoolDoctor.visitRecord.phStatus') },
      colProps: { span: 6 }
    },
    {
      field: 'applyDateRange',
      label: '',
      component: 'ElDatePicker',
      componentProps: {
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        startPlaceholder: t('schoolDoctor.visitRecord.phApplyDateStart'),
        endPlaceholder: t('schoolDoctor.visitRecord.phApplyDateEnd'),
        style: { width: '100%' }
      },
      colProps: { span: 6 }
    }
  ]
})

export const pendingTableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', width: 70, fixed: 'left' },
  { prop: 'schoolName', label: t('schoolDoctor.visitRecord.fieldSchool'), minWidth: 160 },
  { prop: 'admissionNo', label: t('schoolDoctor.visitRecord.fieldAdmissionNo'), minWidth: 120 },
  { prop: 'fullName', label: t('schoolDoctor.visitRecord.fieldName'), minWidth: 120 },
  { prop: 'grade', label: t('schoolDoctor.visitRecord.fieldGrade'), width: 90 },
  { prop: 'formCode', label: t('schoolDoctor.visitRecord.fieldClass'), width: 90 },
  { prop: 'applyMedicationDateText', label: t('schoolDoctor.visitRecord.fieldApplyDate'), width: 180 },
  { prop: 'operationTime', label: t('schoolDoctor.visitRecord.fieldMedicationTime'), width: 170 },
  { prop: 'statusText', label: t('schoolDoctor.visitRecord.fieldStatus'), width: 100 },
  { prop: 'createTime', label: t('schoolDoctor.visitRecord.fieldCreateTime'), width: 170 },
  { prop: 'updateTime', label: t('schoolDoctor.visitRecord.fieldUpdateTime'), width: 170 }
]
