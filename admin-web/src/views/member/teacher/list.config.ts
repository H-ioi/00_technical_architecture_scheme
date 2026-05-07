import type { Recordable, UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

type Translate = (key: string) => string

export const createModuleOptions = (t: Translate): UniOption[] => [
  { label: t('member.options.schoolBus'), value: 1, type: 'primary' },
  { label: t('member.options.activity'), value: 2, type: 'success' }
]

export const createRoleOptions = (t: Translate): UniOption[] => [
  { label: t('member.options.schoolBusOperation'), value: 1, type: 'primary' },
  { label: t('member.options.carTeacher'), value: 2, type: 'success' },
  { label: t('member.options.activityCheckIn'), value: 3, type: 'warning' }
]

export const createStatusOptions = (t: Translate): UniOption[] => [
  { label: t('member.options.enabled'), value: 1, type: 'success' },
  { label: t('member.options.disabled'), value: 0, type: 'info' }
]

const formatOptionLabels = (values: unknown, options: UniOption[]) => {
  if (!Array.isArray(values) || values.length === 0) {
    return '-'
  }

  const valueSet = new Set(values.map(String))
  const labels = options.filter((item) => valueSet.has(String(item.value))).map((item) => item.label)

  return labels.length ? labels.join(' / ') : '-'
}

export const createTeacherSearchConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  moduleOptions: UniOption[],
  roleOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  schema: [
    {
      field: 'nickname',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('member.placeholders.nickname'), clearable: true },
      colProps: { span: 6 }
    },
    {
      field: 'department',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('member.placeholders.department'), clearable: true },
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
      field: 'email',
      label: '',
      component: 'ElInput',
      componentProps: { placeholder: t('member.placeholders.email'), clearable: true },
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
      field: 'modules',
      label: '',
      component: 'ElSelect',
      options: moduleOptions,
      componentProps: {
        placeholder: t('member.placeholders.modules'),
        clearable: true,
        multiple: true,
        collapseTags: true
      },
      colProps: { span: 6 }
    },
    {
      field: 'roles',
      label: '',
      component: 'ElSelect',
      options: roleOptions,
      componentProps: {
        placeholder: t('member.placeholders.roles'),
        clearable: true,
        multiple: true,
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

export const createTeacherColumns = (
  t: Translate,
  schoolOptions: UniOption[],
  moduleOptions: UniOption[],
  roleOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'school', label: t('member.fields.school'), type: 'tag', width: 120, options: schoolOptions },
  { prop: 'nickname', label: t('member.fields.nickname'), type: 'text', minWidth: 130 },
  { prop: 'department', label: t('member.fields.department'), type: 'text', minWidth: 140 },
  { prop: 'email', label: t('member.fields.email'), type: 'copy', minWidth: 190 },
  { prop: 'phone', label: t('member.fields.phone'), type: 'copy', minWidth: 130 },
  {
    prop: 'modules',
    label: t('member.fields.modules'),
    type: 'text',
    minWidth: 150,
    formatter: (row) => formatOptionLabels(row.modules, moduleOptions)
  },
  {
    prop: 'roles',
    label: t('member.fields.roles'),
    type: 'text',
    minWidth: 180,
    formatter: (row) => formatOptionLabels(row.roles, roleOptions)
  },
  { prop: 'status', label: t('member.fields.status'), type: 'tag', width: 90 },
  { prop: 'lastLoginTime', label: t('member.fields.lastLoginTime'), type: 'datetime', minWidth: 170 },
  { prop: 'createTime', label: t('member.fields.createTime'), type: 'datetime', minWidth: 170 }
]

export const createTeacherFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  moduleOptions: UniOption[],
  roleOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  mode: 'edit',
  formProps: { labelWidth: '86px' },
  rowProps: { gutter: 16 },
  colProps: { span: 12 },
  rules: {
    nickname: [{ required: true, message: t('member.validation.nicknameRequired'), trigger: 'blur' }],
    department: [
      { required: true, message: t('member.validation.departmentRequired'), trigger: 'blur' }
    ],
    email: [
      { required: true, message: t('member.validation.emailRequired'), trigger: 'blur' },
      { type: 'email', message: t('member.validation.emailRequired'), trigger: 'blur' }
    ],
    phone: [{ required: true, message: t('member.validation.phoneRequired'), trigger: 'blur' }],
    modules: [
      { type: 'array', required: true, message: t('member.validation.modulesRequired'), trigger: 'change' }
    ],
    roles: [
      { type: 'array', required: true, message: t('member.validation.rolesRequired'), trigger: 'change' }
    ],
    password: [{ required: true, message: t('member.validation.passwordRequired'), trigger: 'blur' }],
    status: [{ required: true, message: t('member.validation.statusRequired'), trigger: 'change' }]
  },
  schema: [
    {
      field: 'school',
      label: t('member.fields.school'),
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { placeholder: t('member.placeholders.school'), clearable: true, filterable: true }
    },
    {
      field: 'nickname',
      label: t('member.fields.nickname'),
      component: 'ElInput',
      componentProps: { placeholder: t('member.placeholders.input'), clearable: true, maxlength: 50 }
    },
    {
      field: 'department',
      label: t('member.fields.department'),
      component: 'ElInput',
      componentProps: { placeholder: t('member.placeholders.input'), clearable: true, maxlength: 50 }
    },
    {
      field: 'email',
      label: t('member.fields.email'),
      component: 'ElInput',
      componentProps: { placeholder: t('member.placeholders.input'), clearable: true, maxlength: 50 }
    },
    {
      field: 'phone',
      label: t('member.fields.phone'),
      component: 'ElInput',
      componentProps: { placeholder: t('member.placeholders.input'), clearable: true, maxlength: 50 }
    },
    {
      field: 'modules',
      label: t('member.fields.modules'),
      component: 'ElSelect',
      options: moduleOptions,
      componentProps: { placeholder: t('member.placeholders.select'), multiple: true, collapseTags: true }
    },
    {
      field: 'roles',
      label: t('member.fields.roles'),
      component: 'ElSelect',
      options: roleOptions,
      componentProps: { placeholder: t('member.placeholders.select'), multiple: true, collapseTags: true }
    },
    {
      field: 'password',
      label: t('member.fields.password'),
      component: 'ElInput',
      componentProps: { placeholder: t('member.placeholders.input'), showPassword: true, maxlength: 50 }
    },
    {
      field: 'status',
      label: t('member.fields.status'),
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { placeholder: t('member.placeholders.select') }
    }
  ]
})

export const createTeacherDetailConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  moduleOptions: UniOption[],
  roleOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => {
  const editConfig = createTeacherFormConfig(t, schoolOptions, moduleOptions, roleOptions, statusOptions)

  return {
    ...editConfig,
    mode: 'view',
    schema: editConfig.schema
      .filter((field) => field.field !== 'password')
      .map((field) => ({
        ...field,
        viewType:
          field.field === 'school' || field.field === 'status'
            ? ('tag' as const)
            : field.viewType,
        viewRender:
          field.field === 'modules'
            ? ({ model }: { model: Recordable }) => formatOptionLabels(model.modules, moduleOptions)
            : field.field === 'roles'
              ? ({ model }: { model: Recordable }) => formatOptionLabels(model.roles, roleOptions)
              : field.viewRender
      })),
    view: { emptyText: '-' }
  }
}
