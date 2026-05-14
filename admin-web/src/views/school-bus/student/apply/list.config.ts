import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

import type { StudentOrderSearchCascade } from '../use-student-order-filters'
import { defaultStudentOrderSearchCascade } from '../use-student-order-filters'

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  approvalOptions: UniOption[],
  sectionOptions: UniOption[],
  lineOptions: UniOption[],
  stationOptions: UniOption[],
  carOptions: { label: string; value: string | number }[],
  multiSchool: boolean,
  cascade: StudentOrderSearchCascade = defaultStudentOrderSearchCascade()
): UniFormConfig => ({
  schema: [
    ...(multiSchool
      ? [
          {
            field: 'schoolIds',
            label: '',
            component: 'ElSelect' as const,
            options: schoolOptions,
            componentProps: {
              placeholder: t('schoolBus.studentApply.phSchool'),
              clearable: true,
              filterable: true,
              multiple: true,
              collapseTags: true
            },
            colProps: { span: 6 }
          }
        ]
      : []),
    {
      field: 'approvalStatus',
      label: '',
      component: 'ElSelect',
      options: approvalOptions,
      componentProps: {
        placeholder: t('schoolBus.studentApply.phApprovalStatus'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'sectionId',
      label: '',
      component: 'ElSelect',
      options: sectionOptions,
      componentProps: {
        placeholder: t('schoolBus.studentApply.phSection'),
        clearable: true,
        filterable: true,
        disabled: cascade.sectionDisabled,
        loading: cascade.optionsLoading
      },
      colProps: { span: 6 }
    },
    {
      field: 'lineIds',
      label: '',
      component: 'ElSelect',
      options: lineOptions,
      componentProps: {
        placeholder: t('schoolBus.studentApply.phLine'),
        clearable: true,
        filterable: true,
        multiple: true,
        collapseTags: true,
        disabled: cascade.lineDisabled,
        loading: cascade.optionsLoading
      },
      colProps: { span: 6 }
    },
    {
      field: 'stationIds',
      label: '',
      component: 'ElSelect',
      options: stationOptions,
      componentProps: {
        placeholder: t('schoolBus.studentApply.phStation'),
        clearable: true,
        filterable: true,
        multiple: true,
        collapseTags: true,
        disabled: cascade.stationDisabled,
        loading: cascade.optionsLoading
      },
      colProps: { span: 6 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('schoolBus.studentApply.phKeyword'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'carInfoId',
      label: '',
      component: 'ElSelect',
      options: carOptions,
      componentProps: {
        placeholder: t('schoolBus.studentApply.phCar'),
        clearable: true,
        loading: cascade.optionsLoading
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const tableCols = (
  t: Translate,
  approvalOptions: UniOption[],
  paymentOptions: UniOption[],
  pickupOptions: UniOption[]
): UniTableColumn[] => [
  {
    prop: 'id',
    label: t('schoolBus.studentApply.colId'),
    type: 'text',
    width: 88,
    fixed: 'left'
  },
  {
    prop: 'createTime',
    label: t('schoolBus.studentApply.colApplyTime'),
    type: 'text',
    minWidth: 160
  },
  {
    prop: 'approvalStatus',
    label: t('schoolBus.studentApply.colApprovalStatus'),
    type: 'tag',
    options: approvalOptions,
    width: 100
  },
  {
    prop: 'paymentStatus',
    label: t('schoolBus.studentApply.colPaymentStatus'),
    type: 'tag',
    options: paymentOptions,
    width: 100
  },
  {
    prop: 'showSchoolName',
    label: t('schoolBus.studentApply.colSchool'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'showSectionName',
    label: t('schoolBus.studentApply.colSection'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'admissionNo',
    label: t('schoolBus.studentApply.colAdmissionNo'),
    type: 'text',
    width: 120
  },
  {
    prop: 'studentName',
    label: t('schoolBus.studentApply.colStudentName'),
    type: 'text',
    minWidth: 180
  },
  {
    prop: 'studentGrade',
    label: t('schoolBus.studentApply.colGrade'),
    type: 'text',
    width: 88
  },
  {
    prop: 'showLineName',
    label: t('schoolBus.studentApply.colLine'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'showStationName',
    label: t('schoolBus.studentApply.colStation'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'pickupMethod',
    label: t('schoolBus.studentApply.colPickup'),
    type: 'tag',
    options: pickupOptions,
    width: 120
  }
]
