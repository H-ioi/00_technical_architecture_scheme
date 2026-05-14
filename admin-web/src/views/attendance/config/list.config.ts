import type { Translate } from '@/types/i18n'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

const DEPARTMENT_OPTS: { labelKey: string; value: string }[] = [
  { labelKey: 'attendance.holidayConfig.deptAll', value: 'all' },
  { labelKey: 'attendance.holidayConfig.deptCourse', value: 'course' },
  { labelKey: 'attendance.holidayConfig.deptDorm', value: 'dorm' },
  { labelKey: 'attendance.holidayConfig.deptBus', value: 'bus' },
  { labelKey: 'attendance.holidayConfig.deptDoctor', value: 'doctor' }
]

/** 与旧 `config.vue` 年级下拉一致。 */
export const HOLIDAY_CONFIG_GRADE_OPTS: UniOption[] = [
  'EY1',
  'EY2',
  'EY3',
  'EY4',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12'
].map((v) => ({ label: v, value: v }))

/** `UniSearchForm` 需要 `UniFormConfig.schema`（与请假 Tab 检索一致），禁止传入裸数组。 */
export const searchForm = (t: Translate, schoolOptions: UniOption[]): UniFormConfig => ({
  schema: [
    {
      field: 'school',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('attendance.phSchool'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 }
})

/** 列必须使用 `prop` / `label` / `formatter`，与 `list.config` 请假表一致；勿用 `field` / `labelKey` / `format'。 */
export const tableCols = (t: Translate): UniTableColumn[] => [
  {
    prop: 'school',
    label: t('attendance.holidayConfig.school'),
    type: 'text',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'grades',
    label: t('attendance.holidayConfig.grades'),
    type: 'tags',
    minWidth: 340
  },
  {
    prop: 'department',
    label: t('attendance.holidayConfig.department'),
    type: 'text',
    minWidth: 100,
    formatter: (row) => {
      const d = String((row as { department?: string }).department ?? '')
      const m = DEPARTMENT_OPTS.find((o) => o.value === d)
      return m ? t(String(m.labelKey)) : d || '-'
    }
  },
  {
    prop: 'email',
    label: t('attendance.holidayConfig.email'),
    type: 'text',
    minWidth: 180,
    showOverflowTooltip: true
  }
]

export const departmentOptionsForForm = (t: Translate) =>
  DEPARTMENT_OPTS.map((o) => ({
    label: t(String(o.labelKey)),
    value: String(o.value)
  }))
