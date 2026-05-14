import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

import type { FollowTeacherFormModel } from '@/types/modules/school-bus-follow-teacher'

export const statusOpts = (t: Translate): UniOption[] => [
  { label: t('schoolBus.driver.optEnabled'), value: 1, type: 'success' },
  { label: t('schoolBus.driver.optDisabled'), value: 0, type: 'info' }
]

/** 模块选项 id 与旧版 `form.vue` 中 `moduleOptions` 一致 */
export const teacherModuleOptions = (t: Translate): UniOption[] => [
  { label: t('schoolBus.followTeacher.modSchoolBus'), value: 1 },
  { label: t('schoolBus.followTeacher.modActivity'), value: 2 }
]

/** 角色选项 id 与旧版 `form.vue` 中 `roleOptions` 一致 */
export const teacherRoleOptions = (t: Translate): UniOption[] => [
  { label: t('schoolBus.followTeacher.roleBusOperation'), value: 1 },
  { label: t('schoolBus.followTeacher.roleCarTeacher'), value: 2 },
  { label: t('schoolBus.followTeacher.roleActivityCheckIn'), value: 3 }
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
      componentProps: {
        placeholder: t('schoolBus.followTeacher.phKeyword'),
        clearable: true
      },
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
              placeholder: t('schoolBus.followTeacher.phSchool'),
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
  rowProps: { gutter: 8 },
  colProps: { span: 8 }
})

export const tableCols = (t: Translate, statusOptions: UniOption[]): UniTableColumn[] => [
  {
    prop: 'id',
    label: t('schoolBus.followTeacher.colId'),
    width: 88,
    fixed: 'left',
    type: 'text'
  },
  {
    prop: 'nickname',
    label: t('schoolBus.followTeacher.colNickname'),
    type: 'text',
    minWidth: 120
  },
  {
    prop: 'schoolLabel',
    label: t('schoolBus.followTeacher.colSchool'),
    type: 'text',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'department',
    label: t('schoolBus.followTeacher.colDepartment'),
    type: 'text',
    minWidth: 100
  },
  { prop: 'email', label: t('schoolBus.followTeacher.colEmail'), type: 'text', minWidth: 160 },
  { prop: 'phone', label: t('schoolBus.followTeacher.colPhone'), type: 'text', width: 130 },
  {
    prop: 'status',
    label: t('schoolBus.followTeacher.colStatus'),
    type: 'tag',
    options: statusOptions,
    width: 96
  },
  {
    prop: 'lastLoginTime',
    label: t('schoolBus.followTeacher.colLastLogin'),
    type: 'text',
    minWidth: 160
  }
]

export const teacherFormRules = (
  t: Translate,
  multiSchool: boolean,
  _mode: 'add' | 'edit' | 'look'
): FormRules<FollowTeacherFormModel> => ({
  ...(multiSchool
    ? {
        school: [
          { required: true, message: t('schoolBus.followTeacher.ruleSchool'), trigger: 'change' }
        ]
      }
    : {}),
  nickname: [
    { required: true, message: t('schoolBus.followTeacher.ruleNickname'), trigger: 'blur' }
  ],
  department: [
    { required: true, message: t('schoolBus.followTeacher.ruleDepartment'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: t('schoolBus.followTeacher.ruleEmail'), trigger: 'blur' },
    { type: 'email', message: t('schoolBus.followTeacher.ruleEmailFormat'), trigger: 'blur' }
  ],
  phone: [{ required: true, message: t('schoolBus.followTeacher.rulePhone'), trigger: 'blur' }],
  modules: [
    {
      validator: (_rule, value, callback) => {
        if (Array.isArray(value) && value.length > 0) {
          callback()
        } else {
          callback(new Error(t('schoolBus.followTeacher.ruleModules')))
        }
      },
      trigger: 'change'
    }
  ],
  roles: [
    {
      validator: (_rule, value, callback) => {
        if (Array.isArray(value) && value.length > 0) {
          callback()
        } else {
          callback(new Error(t('schoolBus.followTeacher.ruleRoles')))
        }
      },
      trigger: 'change'
    }
  ],
  status: [{ required: true, message: t('schoolBus.followTeacher.ruleStatus'), trigger: 'change' }]
})

export const teacherAddPasswordRule = (t: Translate): FormRules<FollowTeacherFormModel> => ({
  password: [
    { required: true, message: t('schoolBus.followTeacher.rulePassword'), trigger: 'blur' }
  ]
})

/** 与旧版 `user/teacher/modal/form.vue` 字段一致（含模块/角色多选）；密码仅新增展示与校验。 */
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
            label: t('schoolBus.followTeacher.fieldSchool'),
            component: 'ElSelect' as const,
            options: schoolOptions,
            componentProps: { filterable: true, clearable: true }
          }
        ]
      : []),
    {
      field: 'nickname',
      label: t('schoolBus.followTeacher.fieldNickname'),
      component: 'ElInput',
      componentProps: { maxlength: 50, clearable: true }
    },
    {
      field: 'department',
      label: t('schoolBus.followTeacher.fieldDepartment'),
      component: 'ElInput',
      componentProps: { maxlength: 50, clearable: true }
    },
    {
      field: 'email',
      label: t('schoolBus.followTeacher.fieldEmail'),
      component: 'ElInput',
      componentProps: { maxlength: 50, clearable: true }
    },
    {
      field: 'phone',
      label: t('schoolBus.followTeacher.fieldPhone'),
      component: 'ElInput',
      componentProps: { maxlength: 50, clearable: true }
    },
    {
      field: 'modules',
      label: t('schoolBus.followTeacher.fieldModules'),
      component: 'ElSelect' as const,
      options: teacherModuleOptions(t),
      componentProps: {
        multiple: true,
        collapseTags: true,
        collapseTagsTooltip: true,
        filterable: true,
        placeholder: t('schoolBus.followTeacher.phSelect')
      }
    },
    {
      field: 'roles',
      label: t('schoolBus.followTeacher.fieldRoles'),
      component: 'ElSelect' as const,
      options: teacherRoleOptions(t),
      componentProps: {
        multiple: true,
        collapseTags: true,
        collapseTagsTooltip: true,
        filterable: true,
        placeholder: t('schoolBus.followTeacher.phSelect')
      }
    },
    ...(mode === 'add'
      ? [
          {
            field: 'password',
            label: t('schoolBus.followTeacher.fieldPassword'),
            component: 'ElInput' as const,
            componentProps: { type: 'password', maxlength: 50, showPassword: true, clearable: true }
          }
        ]
      : []),
    {
      field: 'status',
      label: t('schoolBus.followTeacher.fieldStatus'),
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { placeholder: t('schoolBus.followTeacher.phStatus') }
    }
  ]
})
