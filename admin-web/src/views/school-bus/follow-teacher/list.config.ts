import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

import type { FollowTeacherFormModel } from '@/types/modules/school-bus-follow-teacher'

export const statusOpts = (t: Translate): UniOption[] => [
  { label: t('schoolBus.driver.options.enabled'), value: 1, type: 'success' },
  { label: t('schoolBus.driver.options.disabled'), value: 0, type: 'info' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  multiSchool: boolean
): UniFormConfig => ({
  schema: [
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('schoolBus.followTeacher.placeholders.keyword'), clearable: true },
      colProps: { span: 8 }
    },
    ...(multiSchool
      ? [
          {
            field: 'schoolIds',
            label: '',
            component: 'ElSelect' as const,
            options: schoolOptions,
            componentProps: {
              placeholder: t('schoolBus.followTeacher.placeholders.school'),
              clearable: true,
              filterable: true,
              multiple: true,
              collapseTags: true
            },
            colProps: { span: 8 }
          }
        ]
      : [])
  ],
  rowProps: { gutter: 16 },
  colProps: { span: 8 }
})

export const tableCols = (t: Translate, statusOptions: UniOption[]): UniTableColumn[] => [
  { prop: 'id', label: t('schoolBus.followTeacher.columns.id'), width: 88, fixed: 'left', type: 'text' },
  { prop: 'nickname', label: t('schoolBus.followTeacher.columns.nickname'), type: 'text', minWidth: 120 },
  { prop: 'schoolLabel', label: t('schoolBus.followTeacher.columns.school'), type: 'text', minWidth: 120 },
  { prop: 'department', label: t('schoolBus.followTeacher.columns.department'), type: 'text', minWidth: 100 },
  { prop: 'email', label: t('schoolBus.followTeacher.columns.email'), type: 'text', minWidth: 160 },
  { prop: 'phone', label: t('schoolBus.followTeacher.columns.phone'), type: 'text', width: 130 },
  { prop: 'status', label: t('schoolBus.followTeacher.columns.status'), type: 'tag', options: statusOptions, width: 96 },
  { prop: 'lastLoginTime', label: t('schoolBus.followTeacher.columns.lastLogin'), type: 'text', minWidth: 160 }
]

export const teacherFormRules = (
  t: Translate,
  multiSchool: boolean,
  _mode: 'add' | 'edit' | 'look'
): FormRules<FollowTeacherFormModel> => ({
  ...(multiSchool
    ? { school: [{ required: true, message: t('schoolBus.followTeacher.rules.school'), trigger: 'change' }] }
    : {}),
  nickname: [{ required: true, message: t('schoolBus.followTeacher.rules.nickname'), trigger: 'blur' }],
  department: [{ required: true, message: t('schoolBus.followTeacher.rules.department'), trigger: 'blur' }],
  email: [
    { required: true, message: t('schoolBus.followTeacher.rules.email'), trigger: 'blur' },
    { type: 'email', message: t('schoolBus.followTeacher.rules.emailFormat'), trigger: 'blur' }
  ],
  phone: [{ required: true, message: t('schoolBus.followTeacher.rules.phone'), trigger: 'blur' }],
  status: [{ required: true, message: t('schoolBus.followTeacher.rules.status'), trigger: 'change' }]
})

export const teacherAddPasswordRule = (t: Translate): FormRules<FollowTeacherFormModel> => ({
  password: [{ required: true, message: t('schoolBus.followTeacher.rules.password'), trigger: 'blur' }]
})

export const teacherDialogForm = (
  t: Translate,
  schoolOptions: UniOption[],
  statusOptions: UniOption[],
  multiSchool: boolean,
  mode: 'add' | 'edit' | 'look'
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  rules: {
    ...(teacherFormRules(t, multiSchool, mode) as FormRules<FollowTeacherFormModel>),
    ...(mode === 'add' ? (teacherAddPasswordRule(t) as FormRules<FollowTeacherFormModel>) : {})
  } as UniFormConfig['rules'],
  schema: [
    ...(multiSchool
      ? [
          {
            field: 'school',
            label: t('schoolBus.followTeacher.fields.school'),
            component: 'ElSelect' as const,
            options: schoolOptions,
            componentProps: { filterable: true, clearable: true }
          }
        ]
      : []),
    {
      field: 'nickname',
      label: t('schoolBus.followTeacher.fields.nickname'),
      component: 'ElInput',
      componentProps: { maxlength: 50, clearable: true }
    },
    {
      field: 'department',
      label: t('schoolBus.followTeacher.fields.department'),
      component: 'ElInput',
      componentProps: { maxlength: 50, clearable: true }
    },
    {
      field: 'email',
      label: t('schoolBus.followTeacher.fields.email'),
      component: 'ElInput',
      componentProps: { maxlength: 50, clearable: true }
    },
    {
      field: 'phone',
      label: t('schoolBus.followTeacher.fields.phone'),
      component: 'ElInput',
      componentProps: { maxlength: 50, clearable: true }
    },
    ...(mode === 'add'
      ? [
          {
            field: 'password',
            label: t('schoolBus.followTeacher.fields.password'),
            component: 'ElInput' as const,
            componentProps: { type: 'password', maxlength: 50, showPassword: true, clearable: true }
          }
        ]
      : []),
    {
      field: 'status',
      label: t('schoolBus.followTeacher.fields.status'),
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { placeholder: t('schoolBus.followTeacher.placeholders.status') }
    }
  ]
})
