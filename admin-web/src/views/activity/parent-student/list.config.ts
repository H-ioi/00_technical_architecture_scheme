import type { UniFormConfig, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const searchForm = (t: Translate): UniFormConfig => ({
  schema: [
    {
      field: 'phone',
      component: 'ElInput',
      label: '',
      componentProps: {
        placeholder: t('activity.parentStudentPhonePh'),
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const studentColumns = (t: Translate): UniTableColumn[] => [
  { prop: 'cnName', label: t('activity.parentStudentCnName'), minWidth: 140 },
  { prop: 'enName', label: t('activity.parentStudentEnName'), minWidth: 140 },
  { prop: 'admissionNo', label: t('activity.parentStudentAdmissionNo'), minWidth: 140 },
  { prop: 'grade', label: t('activity.parentStudentGrade'), minWidth: 120 }
]

export const activityColumns = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', minWidth: 88 },
  { prop: 'activityCnName', label: t('activity.parentStudentActivityCnName'), minWidth: 180 },
  { prop: 'activityEnName', label: t('activity.parentStudentActivityEnName'), minWidth: 180 }
]
