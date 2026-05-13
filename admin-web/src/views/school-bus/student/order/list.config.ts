import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
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
              placeholder: t('schoolBus.studentOrder.placeholders.school'),
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
        placeholder: t('schoolBus.studentOrder.placeholders.section'),
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
        placeholder: t('schoolBus.studentOrder.placeholders.line'),
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
        placeholder: t('schoolBus.studentOrder.placeholders.station'),
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
        placeholder: t('schoolBus.studentOrder.placeholders.keyword'),
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
        placeholder: t('schoolBus.studentOrder.placeholders.car'),
        clearable: true
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
    label: t('schoolBus.studentOrder.columns.id'),
    type: 'text',
    width: 88,
    fixed: 'left'
  },
  {
    prop: 'showSchoolName',
    label: t('schoolBus.studentOrder.columns.school'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'showSectionName',
    label: t('schoolBus.studentOrder.columns.section'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'admissionNo',
    label: t('schoolBus.studentOrder.columns.admissionNo'),
    type: 'text',
    width: 120
  },
  {
    prop: 'studentName',
    label: t('schoolBus.studentOrder.columns.studentName'),
    type: 'text',
    minWidth: 100
  },
  {
    prop: 'studentGrade',
    label: t('schoolBus.studentOrder.columns.grade'),
    type: 'text',
    width: 88
  },
  {
    prop: 'showLineName',
    label: t('schoolBus.studentOrder.columns.line'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'showStationName',
    label: t('schoolBus.studentOrder.columns.station'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'pickupMethod',
    label: t('schoolBus.studentOrder.columns.pickup'),
    type: 'tag',
    options: pickupOptions,
    width: 120
  },
  {
    prop: 'createTime',
    label: t('schoolBus.studentOrder.columns.createTime'),
    type: 'text',
    minWidth: 160
  }
]
