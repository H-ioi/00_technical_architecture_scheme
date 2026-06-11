import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

const yesNoOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.common.yes'), value: 1 },
  { label: t('schoolDoctor.common.no'), value: 0 }
]

const archiveStatusOpts = (t: Translate): UniOption[] => [
  { label: t('schoolDoctor.studentRecord.statusPending'), value: 0 },
  { label: t('schoolDoctor.studentRecord.statusActive'), value: 1 },
  { label: t('schoolDoctor.studentRecord.statusCancelled'), value: 2 }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
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
        placeholder: t('schoolDoctor.studentRecord.phSchool')
      },
      defaultValue: defaultSchoolId,
      colProps: { span: 6 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('schoolDoctor.studentRecord.phKeyword') },
      colProps: { span: 6 }
    },
    {
      field: 'hasAllergen',
      label: '',
      component: 'ElSelect',
      options: yesNoOpts(t),
      componentProps: {
        clearable: true,
        placeholder: t('schoolDoctor.studentRecord.phHasAllergen')
      },
      colProps: { span: 6 }
    },
    {
      field: 'regularMedication',
      label: '',
      component: 'ElSelect',
      options: yesNoOpts(t),
      componentProps: {
        clearable: true,
        placeholder: t('schoolDoctor.studentRecord.phRegularMedication')
      },
      colProps: { span: 6 }
    },
    {
      field: 'hasDisease',
      label: '',
      component: 'ElSelect',
      options: yesNoOpts(t),
      componentProps: {
        clearable: true,
        placeholder: t('schoolDoctor.studentRecord.phHasDisease')
      },
      colProps: { span: 6 }
    },
    {
      field: 'status',
      label: '',
      component: 'ElSelect',
      options: archiveStatusOpts(t),
      componentProps: {
        clearable: true,
        placeholder: t('schoolDoctor.studentRecord.phArchiveStatus')
      },
      colProps: { span: 6 }
    }
  ]
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: t('schoolDoctor.studentRecord.fieldId'), width: 70, fixed: 'left' },
  {
    prop: 'schoolName',
    label: t('schoolDoctor.studentRecord.fieldSchool'),
    minWidth: 220,
    fixed: 'left'
  },
  { prop: 'admissionNo', label: t('schoolDoctor.studentRecord.fieldAdmissionNo'), minWidth: 120 },
  { prop: 'fullName', label: t('schoolDoctor.studentRecord.fieldName'), minWidth: 180 },
  { prop: 'grade', label: t('schoolDoctor.studentRecord.fieldGrade'), minWidth: 100 },
  { prop: 'formCode', label: t('schoolDoctor.studentRecord.fieldClass'), minWidth: 100 },
  { prop: 'dormitoryStatusText', label: t('schoolDoctor.studentRecord.fieldBoarding'), width: 100 },
  { prop: 'hasAllergenText', label: t('schoolDoctor.studentRecord.fieldHasAllergen'), width: 120 },
  {
    prop: 'regularMedicationText',
    label: t('schoolDoctor.studentRecord.fieldRegularMedication'),
    width: 160
  },
  { prop: 'hasDiseaseText', label: t('schoolDoctor.studentRecord.fieldHasDisease'), width: 120 },
  { prop: 'statusText', label: t('schoolDoctor.studentRecord.fieldStatus'), width: 100 },
  { prop: 'creator', label: t('schoolDoctor.studentRecord.fieldCreator'), minWidth: 100 },
  { prop: 'createTime', label: t('schoolDoctor.studentRecord.fieldCreateTime'), width: 170 },
  { prop: 'updateTime', label: t('schoolDoctor.studentRecord.fieldUpdateTime'), width: 170 }
]
