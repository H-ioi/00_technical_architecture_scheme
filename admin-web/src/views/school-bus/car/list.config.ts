import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const carStatusOpts = (t: Translate): UniOption[] => [
  { label: t('schoolBus.car.options.free'), value: 0, type: 'info' },
  { label: t('schoolBus.car.options.used'), value: 1, type: 'success' },
  { label: t('schoolBus.car.options.repair'), value: 2, type: 'warning' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  statusOptions: UniOption[],
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
              placeholder: t('schoolBus.car.placeholders.school'),
              clearable: true,
              filterable: true
            },
            colProps: { span: 6 }
          }
        ]
      : []),
    {
      field: 'carNumber',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('schoolBus.car.placeholders.carNumber'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'driver',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('schoolBus.car.placeholders.driver'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'carTeacher',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('schoolBus.car.placeholders.carTeacher'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'status',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: {
        placeholder: t('schoolBus.car.placeholders.status'),
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const tableCols = (
  t: Translate,
  statusOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: t('schoolBus.car.columns.id'), width: 88, fixed: 'left', type: 'text' },
  {
    prop: 'showSchoolNames',
    label: t('schoolBus.car.columns.school'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'carNumber',
    label: t('schoolBus.car.columns.carNumber'),
    type: 'text',
    minWidth: 120
  },
  {
    prop: 'carTeacher',
    label: t('schoolBus.car.columns.carTeacher'),
    type: 'text',
    minWidth: 100
  },
  {
    prop: 'driverName',
    label: t('schoolBus.car.columns.driverName'),
    type: 'text',
    minWidth: 100
  },
  { prop: 'seatNumber', label: t('schoolBus.car.columns.seatNumber'), type: 'text', width: 88 },
  {
    prop: 'status',
    label: t('schoolBus.car.columns.status'),
    type: 'tag',
    options: statusOptions,
    width: 96
  },
  {
    prop: 'createTime',
    label: t('schoolBus.car.columns.createTime'),
    type: 'text',
    minWidth: 160
  },
  {
    prop: 'updateTime',
    label: t('schoolBus.car.columns.updateTime'),
    type: 'text',
    minWidth: 160
  }
]

export interface CarFormModel {
  id?: string | number
  schoolIds?: Array<string | number>
  carNumber?: string
  carTeacherId?: string | number
  seatNumber?: number
  driverId?: string | number
  status?: string | number
  carImageUrl?: string
}

export const carFormRules = (t: Translate, multiSchool: boolean): FormRules<CarFormModel> => ({
  ...(multiSchool
    ? {
        schoolIds: [{ required: true, message: t('schoolBus.car.rules.schoolIds'), trigger: 'change' }]
      }
    : {}),
  carNumber: [{ required: true, message: t('schoolBus.car.rules.carNumber'), trigger: 'blur' }],
  carTeacherId: [{ required: true, message: t('schoolBus.car.rules.carTeacherId'), trigger: 'change' }],
  seatNumber: [{ required: true, message: t('schoolBus.car.rules.seatNumber'), trigger: 'change' }],
  driverId: [{ required: true, message: t('schoolBus.car.rules.driverId'), trigger: 'change' }],
  status: [{ required: true, message: t('schoolBus.car.rules.status'), trigger: 'change' }]
})

export const carDialogFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  driverOptions: UniOption[],
  teacherOptions: UniOption[],
  statusOptions: UniOption[],
  multiSchool: boolean
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  rules: carFormRules(t, multiSchool) as UniFormConfig['rules'],
  schema: [
    ...(multiSchool
      ? [
          {
            field: 'schoolIds',
            label: t('schoolBus.car.fields.school'),
            component: 'ElSelect' as const,
            options: schoolOptions,
            colProps: { span: 24 },
            componentProps: {
              multiple: true,
              collapseTags: true,
              filterable: true,
              clearable: true,
              placeholder: t('schoolBus.car.placeholders.school')
            }
          }
        ]
      : []),
    {
      field: 'carNumber',
      label: t('schoolBus.car.fields.carNumber'),
      component: 'ElInput',
      componentProps: { maxlength: 50, clearable: true }
    },
    {
      field: 'carTeacherId',
      label: t('schoolBus.car.fields.carTeacher'),
      component: 'ElSelect',
      options: teacherOptions,
      componentProps: { filterable: true, clearable: true, placeholder: t('schoolBus.car.placeholders.carTeacher') }
    },
    {
      field: 'seatNumber',
      label: t('schoolBus.car.fields.seatNumber'),
      component: 'ElInputNumber',
      componentProps: {
        min: 1,
        max: 100,
        step: 1,
        precision: 0,
        controlsPosition: 'right',
        style: { width: '100%' }
      }
    },
    {
      field: 'driverId',
      label: t('schoolBus.car.fields.driver'),
      component: 'ElSelect',
      options: driverOptions,
      componentProps: { filterable: true, clearable: true, placeholder: t('schoolBus.car.placeholders.driver') }
    },
    {
      field: 'status',
      label: t('schoolBus.car.fields.status'),
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { placeholder: t('schoolBus.car.placeholders.status') }
    },
    {
      field: 'carImageUrl',
      label: t('schoolBus.car.fields.carImage'),
      component: 'ElInput',
      colProps: { span: 24 },
      componentProps: { type: 'textarea', rows: 2, placeholder: t('schoolBus.car.placeholders.imageUrl') }
    }
  ]
})
