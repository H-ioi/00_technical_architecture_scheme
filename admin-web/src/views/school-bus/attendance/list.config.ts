import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { BusAttendanceFormModel } from '@/types/modules/school-bus-attendance'

export const rideTypeOpts = (t: Translate): UniOption[] => [
  { label: t('schoolBus.attendance.rideBoarding'), value: 1 },
  { label: t('schoolBus.attendance.rideAlighting'), value: 2 }
]

export const attendanceStatusOpts = (t: Translate): UniOption[] => [
  { label: t('schoolBus.attendance.statusNormal'), value: 0, type: 'success' },
  { label: t('schoolBus.attendance.statusLeave'), value: 1, type: 'warning' },
  { label: t('schoolBus.attendance.statusAbsent'), value: 2, type: 'danger' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  lineOptions: UniOption[],
  stationOptions: UniOption[],
  statusOptions: UniOption[],
  defaultSchoolId?: string | number | null
): UniFormConfig => ({
  schema: [
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      ...(defaultSchoolId != null ? { defaultValue: defaultSchoolId } : {}),
      componentProps: {
        placeholder: t('schoolBus.attendance.fieldSchool'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('schoolBus.attendance.phKeyword'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'dateRange',
      label: '',
      component: 'ElDatePicker',
      componentProps: {
        type: 'daterange',
        rangeSeparator: t('schoolBus.attendance.dateTo'),
        startPlaceholder: t('schoolBus.attendance.dateStart'),
        endPlaceholder: t('schoolBus.attendance.dateEnd'),
        valueFormat: 'YYYY-MM-DD',
        style: { width: '100%' }
      },
      colProps: { span: 6 }
    },
    {
      field: 'formCode',
      label: '',
      component: 'ElInput',
      componentProps: {
        placeholder: t('schoolBus.attendance.fieldClass'),
        clearable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'lineId',
      label: '',
      component: 'ElSelect',
      options: lineOptions,
      componentProps: {
        placeholder: t('schoolBus.attendance.phLine'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'stationId',
      label: '',
      component: 'ElSelect',
      options: stationOptions,
      componentProps: {
        placeholder: t('schoolBus.attendance.phStation'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'attendanceStatus',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: {
        placeholder: t('schoolBus.attendance.fieldStatus'),
        clearable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const tableCols = (
  t: Translate,
  rideOptions: UniOption[],
  statusOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 72, fixed: 'left' },
  {
    prop: 'schoolName',
    label: t('schoolBus.attendance.fieldSchool'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'admissionNo',
    label: t('schoolBus.attendance.fieldAdmissionNo'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'studentName',
    label: t('schoolBus.attendance.fieldName'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  { prop: 'grade', label: t('schoolBus.attendance.fieldGrade'), type: 'text', width: 96 },
  { prop: 'formCode', label: t('schoolBus.attendance.fieldClass'), type: 'text', width: 88 },
  {
    prop: 'attendanceDate',
    label: t('schoolBus.attendance.fieldDate'),
    type: 'text',
    width: 120
  },
  {
    prop: 'lineName',
    label: t('schoolBus.attendance.fieldLine'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'stationName',
    label: t('schoolBus.attendance.fieldStation'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'rideType',
    label: t('schoolBus.attendance.fieldRideType'),
    type: 'tag',
    options: rideOptions,
    width: 110
  },
  {
    prop: 'attendanceStatus',
    label: t('schoolBus.attendance.fieldStatus'),
    type: 'tag',
    options: statusOptions,
    width: 100
  },
  {
    prop: 'operator',
    label: t('schoolBus.attendance.fieldOperator'),
    type: 'text',
    width: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'createTime',
    label: t('schoolBus.attendance.fieldCreateTime'),
    type: 'text',
    width: 168
  },
  {
    prop: 'remark',
    label: t('schoolBus.attendance.fieldRemark'),
    type: 'text',
    minWidth: 120,
    showOverflowTooltip: true
  }
]

export const drawerFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  lineOptions: UniOption[],
  stationOptions: UniOption[],
  rideOptions: UniOption[],
  statusOptions: UniOption[],
  showSchoolField: boolean,
  isReadonly: boolean
): UniFormConfig => {
  const schema: UniFormConfig['schema'] = []

  if (showSchoolField) {
    schema.push({
      field: 'schoolId',
      label: t('schoolBus.attendance.fieldSchool'),
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('schoolBus.pleaseSelect'),
        clearable: true,
        filterable: true,
        disabled: isReadonly
      },
      colProps: { span: 12 }
    })
  }

  schema.push(
    {
      field: 'admissionNo',
      label: t('schoolBus.attendance.fieldAdmissionNo'),
      component: 'ElInput',
      componentProps: { style: { display: 'none' } },
      colProps: { span: showSchoolField ? 12 : 24 }
    },
    {
      field: 'studentName',
      label: t('schoolBus.attendance.fieldName'),
      component: 'ElInput',
      componentProps: { disabled: true },
      colProps: { span: 12 }
    },
    {
      field: 'studentGrade',
      label: t('schoolBus.attendance.fieldGrade'),
      component: 'ElInput',
      componentProps: { disabled: true },
      colProps: { span: 12 }
    },
    {
      field: 'formCode',
      label: t('schoolBus.attendance.fieldClass'),
      component: 'ElInput',
      componentProps: { disabled: true },
      colProps: { span: 12 }
    },
    {
      field: 'attendanceDate',
      label: t('schoolBus.attendance.fieldDate'),
      component: 'ElDatePicker',
      componentProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
        placeholder: t('schoolBus.pleaseSelect'),
        disabled: isReadonly,
        style: { width: '100%' }
      },
      colProps: { span: 12 }
    },
    {
      field: 'lineId',
      label: t('schoolBus.attendance.fieldLine'),
      component: 'ElSelect',
      options: lineOptions,
      componentProps: {
        placeholder: t('schoolBus.pleaseSelect'),
        filterable: true,
        disabled: isReadonly
      },
      colProps: { span: 12 }
    },
    {
      field: 'stationId',
      label: t('schoolBus.attendance.fieldStation'),
      component: 'ElSelect',
      options: stationOptions,
      componentProps: {
        placeholder: t('schoolBus.pleaseSelect'),
        filterable: true,
        disabled: isReadonly
      },
      colProps: { span: 12 }
    },
    {
      field: 'rideType',
      label: t('schoolBus.attendance.fieldRideType'),
      component: 'ElSelect',
      options: rideOptions,
      componentProps: {
        placeholder: t('schoolBus.pleaseSelect'),
        disabled: isReadonly
      },
      colProps: { span: 12 }
    },
    {
      field: 'attendanceStatus',
      label: t('schoolBus.attendance.fieldStatus'),
      component: 'ElSelect',
      options: statusOptions,
      componentProps: {
        placeholder: t('schoolBus.pleaseSelect'),
        disabled: isReadonly
      },
      colProps: { span: 12 }
    },
    {
      field: 'remark',
      label: t('schoolBus.attendance.fieldRemark'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 3,
        maxlength: 500,
        showWordLimit: true,
        disabled: isReadonly
      },
      colProps: { span: 24 }
    }
  )

  return {
    formProps: { labelPosition: 'top' },
    rowProps: { gutter: 20 },
    colProps: { span: 24 },
    schema
  }
}

export const drawerFormRules = (t: Translate, requireSchool: boolean): FormRules => {
  const rules: FormRules = {
    admissionNo: [
      { required: true, message: t('schoolBus.attendance.ruleAdmissionNo'), trigger: 'blur' }
    ],
    studentName: [
      { required: true, message: t('schoolBus.attendance.ruleStudentName'), trigger: 'blur' }
    ],
    attendanceDate: [
      { required: true, message: t('schoolBus.attendance.ruleDate'), trigger: 'change' }
    ],
    lineId: [{ required: true, message: t('schoolBus.attendance.ruleLine'), trigger: 'change' }],
    stationId: [
      { required: true, message: t('schoolBus.attendance.ruleStation'), trigger: 'change' }
    ],
    rideType: [
      { required: true, message: t('schoolBus.attendance.ruleRideType'), trigger: 'change' }
    ],
    attendanceStatus: [
      { required: true, message: t('schoolBus.attendance.ruleStatus'), trigger: 'change' }
    ]
  }

  if (requireSchool) {
    rules.schoolId = [
      { required: true, message: t('schoolBus.attendance.ruleSchool'), trigger: 'change' }
    ]
  }

  return rules
}

export const emptyFormModel = (): BusAttendanceFormModel => ({})
