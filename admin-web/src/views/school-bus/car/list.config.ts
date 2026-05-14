import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

export const carStatusOpts = (t: Translate): UniOption[] => [
  { label: t('schoolBus.car.optFree'), value: 0, type: 'info' },
  { label: t('schoolBus.car.optUsed'), value: 1, type: 'success' },
  { label: t('schoolBus.car.optRepair'), value: 2, type: 'warning' }
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
              placeholder: t('schoolBus.car.phSchool'),
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
        placeholder: t('schoolBus.car.phCarNumber'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'driver',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('schoolBus.car.phDriver'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'carTeacher',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('schoolBus.car.phCarTeacher'),
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
        placeholder: t('schoolBus.car.phStatus'),
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const tableCols = (t: Translate, statusOptions: UniOption[]): UniTableColumn[] => [
  { prop: 'id', label: t('schoolBus.car.colId'), width: 88, fixed: 'left', type: 'text' },
  {
    prop: 'showSchoolNames',
    label: t('schoolBus.car.colSchool'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'carNumber',
    label: t('schoolBus.car.colCarNumber'),
    type: 'text',
    minWidth: 120
  },
  {
    prop: 'carTeacher',
    label: t('schoolBus.car.colCarTeacher'),
    type: 'text',
    minWidth: 100
  },
  {
    prop: 'driverName',
    label: t('schoolBus.car.colDriverName'),
    type: 'text',
    minWidth: 100
  },
  { prop: 'seatNumber', label: t('schoolBus.car.colSeatNumber'), type: 'text', width: 88 },
  {
    prop: 'status',
    label: t('schoolBus.car.colStatus'),
    type: 'tag',
    options: statusOptions,
    width: 96
  },
  {
    prop: 'createTime',
    label: t('schoolBus.car.colCreateTime'),
    type: 'text',
    minWidth: 160
  },
  {
    prop: 'updateTime',
    label: t('schoolBus.car.colUpdateTime'),
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
        schoolIds: [
          { required: true, message: t('schoolBus.car.ruleSchoolIds'), trigger: 'change' }
        ]
      }
    : {}),
  carNumber: [{ required: true, message: t('schoolBus.car.ruleCarNumber'), trigger: 'blur' }],
  carTeacherId: [
    { required: true, message: t('schoolBus.car.ruleCarTeacherId'), trigger: 'change' }
  ],
  seatNumber: [{ required: true, message: t('schoolBus.car.ruleSeatNumber'), trigger: 'change' }],
  driverId: [{ required: true, message: t('schoolBus.car.ruleDriverId'), trigger: 'change' }],
  status: [{ required: true, message: t('schoolBus.car.ruleStatus'), trigger: 'change' }]
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
            label: t('schoolBus.car.fieldSchool'),
            component: 'ElSelect' as const,
            options: schoolOptions,
            colProps: { span: 24 },
            componentProps: {
              multiple: true,
              collapseTags: true,
              filterable: true,
              clearable: true,
              placeholder: t('schoolBus.car.phSchool')
            }
          }
        ]
      : []),
    {
      field: 'carNumber',
      label: t('schoolBus.car.fieldCarNumber'),
      component: 'ElInput',
      componentProps: { maxlength: 50, clearable: true }
    },
    {
      field: 'carTeacherId',
      label: t('schoolBus.car.fieldCarTeacher'),
      component: 'ElSelect',
      options: teacherOptions,
      componentProps: {
        filterable: true,
        clearable: true,
        placeholder: t('schoolBus.car.phCarTeacher')
      }
    },
    {
      field: 'seatNumber',
      label: t('schoolBus.car.fieldSeatNumber'),
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
      label: t('schoolBus.car.fieldDriver'),
      component: 'ElSelect',
      options: driverOptions,
      componentProps: {
        filterable: true,
        clearable: true,
        placeholder: t('schoolBus.car.phDriver')
      }
    },
    {
      field: 'status',
      label: t('schoolBus.car.fieldStatus'),
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { placeholder: t('schoolBus.car.phStatus') }
    },
    {
      field: 'carImageUrl',
      label: t('schoolBus.car.fieldCarImage'),
      component: 'ElInput',
      colProps: { span: 24 },
      componentProps: {
        type: 'textarea',
        rows: 2,
        placeholder: t('schoolBus.car.phImageUrl')
      }
    }
  ]
})
