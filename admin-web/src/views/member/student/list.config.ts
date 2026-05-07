import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

type Translate = (key: string) => string

export const createStatusOptions = (t: Translate): UniOption[] => [
  { label: t('member.options.enabled'), value: 1, type: 'success' },
  { label: t('member.options.disabled'), value: 0, type: 'info' }
]

export const createStudentSearchConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  schema: [
    {
      field: 'name',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('member.student.placeholders.name'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'grade',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('member.student.placeholders.grade'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'className',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('member.student.placeholders.className'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'parentName',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('member.student.placeholders.parentName'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'phone',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('member.placeholders.phone'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'schoolIds',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('member.placeholders.school'),
        clearable: true,
        multiple: true,
        filterable: true,
        collapseTags: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'status',
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

export const createStudentColumns = (
  t: Translate,
  schoolOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'school', label: t('member.fields.school'), type: 'tag', width: 120, options: schoolOptions },
  { prop: 'name', label: t('member.student.fields.name'), type: 'text', minWidth: 120 },
  { prop: 'grade', label: t('member.student.fields.grade'), type: 'text', width: 110 },
  { prop: 'className', label: t('member.student.fields.className'), type: 'text', width: 110 },
  { prop: 'parentName', label: t('member.student.fields.parentName'), type: 'text', minWidth: 120 },
  { prop: 'phone', label: t('member.fields.phone'), type: 'copy', minWidth: 130 },
  { prop: 'status', label: t('member.fields.status'), type: 'tag', width: 90 },
  { prop: 'createTime', label: t('member.fields.createTime'), type: 'datetime', minWidth: 170 }
]
