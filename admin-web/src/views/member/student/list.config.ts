import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

type Translate = (key: string) => string

export const createDormitoryOptions = (): UniOption[] => [
  { label: 'Yes', value: '1', type: 'success' },
  { label: 'No', value: '0', type: 'info' }
]

export const createBusOptions = (): UniOption[] => [
  { label: 'Yes', value: '1', type: 'success' },
  { label: 'No', value: '0', type: 'info' }
]

export const createStatusOptions = (t: Translate): UniOption[] => [
  { label: t('member.student.options.enrolled'), value: '1', type: 'success' },
  { label: t('member.student.options.leaving'), value: '2', type: 'warning' }
]

export const createSearchConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  yearGroupOptions: UniOption[],
  formOptions: UniOption[],
  dormitoryOptions: UniOption[],
  busOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  schema: [
    {
      field: 'keywordssearch',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('member.placeholders.keywordInput'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'schoolIds',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { placeholder: t('member.placeholders.school'), clearable: true, filterable: true },
      colProps: { span: 6 }
    },
    {
      field: 'yearGroupName',
      label: '',
      component: 'ElSelect',
      options: yearGroupOptions,
      componentProps: {
        placeholder: t('member.student.placeholders.yearGroup'),
        clearable: true,
        multiple: true,
        collapseTags: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'form',
      label: '',
      component: 'ElSelect',
      options: formOptions,
      componentProps: {
        placeholder: t('member.student.placeholders.form'),
        clearable: true,
        multiple: true,
        collapseTags: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'dormitoryStatus',
      label: '',
      component: 'ElSelect',
      options: dormitoryOptions,
      componentProps: { placeholder: t('member.student.placeholders.dormitory'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'busStatus',
      label: '',
      component: 'ElSelect',
      options: busOptions,
      componentProps: { placeholder: t('member.student.placeholders.bus'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'studentStatus',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { placeholder: t('member.placeholders.status'), clearable: true },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 6 }
})

export const createColumns = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 90, fixed: 'left' },
  { prop: 'schoolName', label: t('member.fields.school'), type: 'text', minWidth: 140 },
  { prop: 'admissonNo', label: t('member.student.fields.admissionNo'), type: 'text', minWidth: 120 },
  { prop: 'cnFullName', label: t('member.student.fields.cnFullName'), type: 'text', minWidth: 120 },
  { prop: 'fullName', label: t('member.student.fields.fullName'), type: 'text', minWidth: 140 },
  { prop: 'grade', label: t('member.student.fields.grade'), type: 'text', width: 110 },
  { prop: 'formCode', label: t('member.student.fields.form'), type: 'text', width: 110 },
  { prop: 'busStatus', label: t('member.student.fields.bus'), type: 'tag', width: 90 },
  { prop: 'dormitoryStatus', label: t('member.student.fields.dormitory'), type: 'tag', width: 90 },
  { prop: 'studentStatus', label: t('member.fields.status'), type: 'tag', width: 110 }
]
