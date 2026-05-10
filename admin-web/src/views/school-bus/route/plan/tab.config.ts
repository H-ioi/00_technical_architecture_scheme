import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniFormField, UniOption } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 路线弹窗：路线类型 / 可见性 / 周一至周五（与旧版 consts 对齐） */
export const ROUTE_FORM_CONSTS = {
  routeType: [
    { labelKey: 'schoolBus.routePlan.routeType.daily', value: '1' },
    { labelKey: 'schoolBus.routePlan.routeType.weekly', value: '2' }
  ],
  visibleType: [
    { labelKey: 'schoolBus.routePlan.visible.no', value: false },
    { labelKey: 'schoolBus.routePlan.visible.yes', value: true }
  ],
  WeeklyDays: [
    { label: 'Mondays', value: 'Mon' },
    { label: 'Tuesdays', value: 'Tue' },
    { label: 'Wednesdays', value: 'Wed' },
    { label: 'Thursdays', value: 'Thu' },
    { label: 'Fridays', value: 'Fri' }
  ]
}

export type BindStationCol = {
  prop: string
  labelKey: string
  width?: number
  minWidth?: number
  fixed?: 'left' | 'right'
}

export const BIND_STATION_TABLE_COLS: BindStationCol[] = [
  { prop: 'stationName', labelKey: 'schoolBus.routePlan.form.stationCol.name', minWidth: 120 },
  { prop: 'showGoTime', labelKey: 'schoolBus.routePlan.form.stationCol.goTime', width: 120 },
  { prop: 'showBackTime', labelKey: 'schoolBus.routePlan.form.stationCol.backTime', width: 120 },
  { prop: 'price', labelKey: 'schoolBus.routePlan.form.stationCol.price', width: 100 },
  { prop: 'weekPrice', labelKey: 'schoolBus.routePlan.form.stationCol.weekPrice', width: 100 }
]

/** 学期新增弹窗 */
export const termDialogFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  multiSchool: boolean
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 16 },
  colProps: { span: 24 },
  rules: termDialogRules(t, multiSchool) as UniFormConfig['rules'],
  schema: [
    {
      field: 'schoolIds',
      label: t('schoolBus.routeOperation.form.school'),
      component: 'ElSelect',
      options: schoolOptions,
      hidden: !multiSchool,
      componentProps: {
        multiple: true,
        collapseTags: true,
        clearable: true,
        filterable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect'),
        style: { width: '100%' }
      },
      viewRender: ({ value }) => {
        const ids = Array.isArray(value) ? value : []
        if (!ids.length) {
          return '--'
        }

        return ids
          .map(
            (id) => schoolOptions.find((o) => String(o.value) === String(id))?.label ?? String(id)
          )
          .join('、')
      }
    },
    {
      field: 'cnName',
      label: t('schoolBus.routePlan.form.cnName'),
      component: 'ElInput',
      componentProps: {
        maxlength: 50,
        clearable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect')
      }
    },
    {
      field: 'enName',
      label: t('schoolBus.routePlan.form.enName'),
      component: 'ElInput',
      componentProps: {
        maxlength: 50,
        clearable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect')
      }
    },
    {
      field: 'intentDate',
      label: t('schoolBus.routePlan.form.intentRange'),
      component: 'ElDatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        style: { width: '100%' },
        startPlaceholder: t('schoolBus.routeOperation.placeholders.rideDateStart'),
        endPlaceholder: t('schoolBus.routeOperation.placeholders.rideDateEnd')
      }
    },
    {
      field: 'serviceDate',
      label: t('schoolBus.routePlan.form.serviceRange'),
      component: 'ElDatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        style: { width: '100%' },
        startPlaceholder: t('schoolBus.routeOperation.placeholders.rideDateStart'),
        endPlaceholder: t('schoolBus.routeOperation.placeholders.rideDateEnd')
      }
    }
  ]
})

export const termDialogRules = (t: Translate, multiSchool: boolean): FormRules => ({
  ...(multiSchool
    ? {
        schoolIds: [
          { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
        ]
      }
    : {}),
  cnName: [
    { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'blur' }
  ],
  enName: [
    { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'blur' }
  ],
  intentDate: [
    { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
  ],
  serviceDate: [
    { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
  ]
})

/** 站点新增弹窗 */
export const stationDialogFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  multiSchool: boolean
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 16 },
  colProps: { span: 24 },
  rules: stationDialogRules(t, multiSchool) as UniFormConfig['rules'],
  schema: [
    {
      field: 'schoolIds',
      label: t('schoolBus.routeOperation.form.school'),
      component: 'ElSelect',
      options: schoolOptions,
      hidden: !multiSchool,
      componentProps: {
        multiple: true,
        collapseTags: true,
        clearable: true,
        filterable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect'),
        style: { width: '100%' }
      },
      viewRender: ({ value }) => {
        const ids = Array.isArray(value) ? value : []
        if (!ids.length) {
          return '--'
        }

        return ids
          .map(
            (id) => schoolOptions.find((o) => String(o.value) === String(id))?.label ?? String(id)
          )
          .join('、')
      }
    },
    {
      field: 'cnName',
      label: t('schoolBus.routePlan.form.cnName'),
      component: 'ElInput',
      componentProps: {
        maxlength: 50,
        clearable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect')
      }
    },
    {
      field: 'enName',
      label: t('schoolBus.routePlan.form.enName'),
      component: 'ElInput',
      componentProps: {
        maxlength: 50,
        clearable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect')
      }
    }
  ]
})

export const stationDialogRules = (t: Translate, multiSchool: boolean): FormRules => ({
  ...(multiSchool
    ? {
        schoolIds: [
          { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
        ]
      }
    : {}),
  cnName: [
    { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'blur' }
  ],
  enName: [{ required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'blur' }]
})

/** 路线主表（周几/站点矩阵通过 `#field-routeStopsEditor` 插槽渲染） */
export type RoutePlanMainFormDeps = {
  showSchoolSelect: boolean
  schoolOptions: UniOption[]
  sectionOptions: UniOption[]
  carOptions: UniOption[]
  routeTypeOptions: UniOption[]
  visibleOptions: UniOption[]
  onSchoolIdsChange: (ids: unknown) => void | Promise<void>
}

export const routePlanMainFormConfig = (
  t: Translate,
  deps: RoutePlanMainFormDeps,
  /** 单校场景校区不展示，服务端仍依赖 schoolIds，校验由提交前数据保证 */
  includeSchoolIdsRule: boolean
): UniFormConfig => {
  const rules = { ...routePlanMainRules(t) } as Record<string, unknown>

  if (!includeSchoolIdsRule) {
    delete rules.schoolIds
  }

  return {
    formProps: { labelPosition: 'top' },
    rowProps: { gutter: 16 },
    colProps: { span: 8 },
    rules: rules as UniFormConfig['rules'],
    schema: routePlanMainFormSchema(t, deps)
  }
}

export const routePlanMainRules = (t: Translate): FormRules => ({
  schoolIds: [
    { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
  ],
  sectionId: [
    { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
  ],
  cnName: [
    { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'blur' }
  ],
  enName: [
    { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'blur' }
  ],
  lineType: [
    { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
  ],
  carIdList: [
    { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
  ],
  visible: [
    { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
  ]
})

function routePlanMainFormSchema(t: Translate, deps: RoutePlanMainFormDeps): UniFormField[] {
  return [
    {
      field: 'schoolIds',
      label: t('schoolBus.routeOperation.form.school'),
      component: 'ElSelect',
      options: deps.schoolOptions,
      hidden: !deps.showSchoolSelect,
      onChange: async (ctx) => {
        await deps.onSchoolIdsChange(ctx.model.schoolIds)
      },
      componentProps: {
        multiple: true,
        collapseTags: true,
        clearable: true,
        filterable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect'),
        style: { width: '100%' }
      },
      colProps: { span: 8 }
    },
    {
      field: 'sectionId',
      label: t('schoolBus.routeOperation.form.section'),
      component: 'ElSelect',
      options: deps.sectionOptions,
      componentProps: {
        filterable: true,
        clearable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect'),
        style: { width: '100%' }
      },
      colProps: { span: 8 }
    },
    {
      field: 'cnName',
      label: t('schoolBus.routePlan.form.cnName'),
      component: 'ElInput',
      componentProps: {
        maxlength: 50,
        clearable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect')
      },
      colProps: { span: 8 }
    },
    {
      field: 'enName',
      label: t('schoolBus.routePlan.form.enName'),
      component: 'ElInput',
      componentProps: {
        maxlength: 50,
        clearable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect')
      },
      colProps: { span: 8 }
    },
    {
      field: 'lineType',
      label: t('schoolBus.routePlan.form.lineType'),
      component: 'ElSelect',
      options: deps.routeTypeOptions,
      componentProps: {
        placeholder: t('schoolBus.routeOperation.pleaseSelect'),
        style: { width: '100%' }
      },
      colProps: { span: 8 }
    },
    {
      field: 'carIdList',
      label: t('schoolBus.routePlan.form.plateList'),
      component: 'ElSelect',
      options: deps.carOptions,
      componentProps: {
        multiple: true,
        collapseTags: true,
        filterable: true,
        clearable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect'),
        style: { width: '100%' }
      },
      colProps: { span: 8 }
    },
    {
      field: 'visible',
      label: t('schoolBus.routePlan.form.status'),
      component: 'ElRadioGroup',
      options: deps.visibleOptions,
      componentProps: {
        style: { width: '100%' }
      },
      colProps: { span: 24 }
    },
    {
      field: 'routeStopsEditor',
      label: '',
      component: 'ElInput',
      colProps: { span: 24 },
      formItemProps: { class: 'route-plan-main-form__stops-slot' }
    }
  ]
}

/** 路线弹窗内「绑定站点」子表单 */
export const routePlanNestedStationFormConfig = (t: Translate): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 12 },
  colProps: { span: 24 },
  rules: routePlanNestedStationRules(t) as UniFormConfig['rules'],
  schema: [
    {
      field: 'stationId',
      label: t('schoolBus.routePlan.form.stop'),
      component: 'ElSelect',
      options: [],
      componentProps: {
        filterable: true,
        clearable: true,
        placeholder: t('schoolBus.routeOperation.pleaseSelect'),
        style: { width: '100%' }
      }
    },
    {
      field: 'goTime',
      label: t('schoolBus.routePlan.form.stationCol.goTime'),
      component: 'ElTimePicker',
      componentProps: {
        format: 'HH:mm',
        valueFormat: 'HH:mm:ss',
        placeholder: t('schoolBus.routeOperation.pleaseSelect'),
        style: { width: '100%' }
      }
    },
    {
      field: 'backTime',
      label: t('schoolBus.routePlan.form.afternoonLeave'),
      component: 'ElTimePicker',
      componentProps: {
        format: 'HH:mm',
        valueFormat: 'HH:mm:ss',
        placeholder: t('schoolBus.routeOperation.pleaseSelect'),
        style: { width: '100%' }
      }
    },
    {
      field: 'price',
      label: t('schoolBus.routePlan.form.dayPrice'),
      component: 'ElInputNumber',
      componentProps: {
        precision: 2,
        step: 0.1,
        min: 0,
        style: { width: '100%' }
      }
    },
    {
      field: 'weekPrice',
      label: t('schoolBus.routePlan.form.weekPriceLabel'),
      component: 'ElInputNumber',
      componentProps: {
        precision: 2,
        step: 0.1,
        min: 0,
        style: { width: '100%' }
      }
    }
  ]
})

export const routePlanNestedStationRules = (t: Translate): FormRules => ({
  stationId: [
    { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
  ],
  price: [
    { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
  ],
  weekPrice: [
    { required: true, message: t('schoolBus.routeOperation.pleaseSelect'), trigger: 'change' }
  ]
})
