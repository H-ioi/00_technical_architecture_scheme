import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

import type { StudentOrderSearchCascade } from '../use-student-order-filters'
import { defaultStudentOrderSearchCascade } from '../use-student-order-filters'

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
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
              placeholder: t('schoolBus.studentOrder.phSchool'),
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
      field: 'sectionId',
      label: '',
      component: 'ElSelect',
      options: sectionOptions,
      componentProps: {
        placeholder: t('schoolBus.studentOrder.phSection'),
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
        placeholder: t('schoolBus.studentOrder.phLine'),
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
        placeholder: t('schoolBus.studentOrder.phStation'),
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
        placeholder: t('schoolBus.studentOrder.phKeyword'),
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
        placeholder: t('schoolBus.studentOrder.phCar'),
        clearable: true,
        loading: cascade.optionsLoading
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const tableCols = (t: Translate, pickupOptions: UniOption[]): UniTableColumn[] => [
  {
    prop: 'id',
    label: t('schoolBus.studentOrder.colId'),
    type: 'text',
    width: 88,
    fixed: 'left'
  },
  {
    prop: 'showSchoolName',
    label: t('schoolBus.studentOrder.colSchool'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'showSectionName',
    label: t('schoolBus.studentOrder.colSection'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'admissionNo',
    label: t('schoolBus.studentOrder.colAdmissionNo'),
    type: 'text',
    width: 120
  },
  {
    prop: 'studentName',
    label: t('schoolBus.studentOrder.colStudentName'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'studentGrade',
    label: t('schoolBus.studentOrder.colGrade'),
    type: 'text',
    width: 88
  },
  {
    prop: 'showLineName',
    label: t('schoolBus.studentOrder.colLine'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'showStationName',
    label: t('schoolBus.studentOrder.colStation'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'pickupMethod',
    label: t('schoolBus.studentOrder.colPickup'),
    type: 'tag',
    options: pickupOptions,
    width: 120
  },
  {
    prop: 'createTime',
    label: t('schoolBus.studentOrder.colCreateTime'),
    type: 'text',
    minWidth: 160
  }
]
