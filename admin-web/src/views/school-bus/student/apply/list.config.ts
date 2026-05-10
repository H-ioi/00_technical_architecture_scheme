import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const applySearchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  approvalOptions: UniOption[],
  sectionOptions: UniOption[],
  lineOptions: UniOption[],
  stationOptions: UniOption[],
  carOptions: { label: string; value: string | number }[],
  multiSchool: boolean
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
              placeholder: t('schoolBus.studentApply.placeholders.school'),
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
        placeholder: t('schoolBus.studentApply.placeholders.approvalStatus'),
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
        placeholder: t('schoolBus.studentApply.placeholders.section'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'lineIds',
      label: '',
      component: 'ElSelect',
      options: lineOptions,
      componentProps: {
        placeholder: t('schoolBus.studentApply.placeholders.line'),
        clearable: true,
        filterable: true,
        multiple: true,
        collapseTags: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'stationIds',
      label: '',
      component: 'ElSelect',
      options: stationOptions,
      componentProps: {
        placeholder: t('schoolBus.studentApply.placeholders.station'),
        clearable: true,
        filterable: true,
        multiple: true,
        collapseTags: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('schoolBus.studentApply.placeholders.keyword'),
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
        placeholder: t('schoolBus.studentApply.placeholders.car'),
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const applyTableColumns = (
  t: Translate,
  approvalOptions: UniOption[],
  paymentOptions: UniOption[],
  pickupOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: t('schoolBus.studentApply.columns.id'), type: 'text', width: 88, fixed: 'left' },
  {
    prop: 'createTime',
    label: t('schoolBus.studentApply.columns.applyTime'),
    type: 'text',
    minWidth: 160
  },
  {
    prop: 'approvalStatus',
    label: t('schoolBus.studentApply.columns.approvalStatus'),
    type: 'tag',
    options: approvalOptions,
    width: 100
  },
  {
    prop: 'paymentStatus',
    label: t('schoolBus.studentApply.columns.paymentStatus'),
    type: 'tag',
    options: paymentOptions,
    width: 100
  },
  {
    prop: 'showSchoolName',
    label: t('schoolBus.studentApply.columns.school'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'showSectionName',
    label: t('schoolBus.studentApply.columns.section'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'admissionNo',
    label: t('schoolBus.studentApply.columns.admissionNo'),
    type: 'text',
    width: 120
  },
  {
    prop: 'studentName',
    label: t('schoolBus.studentApply.columns.studentName'),
    type: 'text',
    minWidth: 100
  },
  {
    prop: 'studentGrade',
    label: t('schoolBus.studentApply.columns.grade'),
    type: 'text',
    width: 88
  },
  {
    prop: 'showLineName',
    label: t('schoolBus.studentApply.columns.line'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'showStationName',
    label: t('schoolBus.studentApply.columns.station'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'pickupMethod',
    label: t('schoolBus.studentApply.columns.pickup'),
    type: 'tag',
    options: pickupOptions,
    width: 120
  }
]
