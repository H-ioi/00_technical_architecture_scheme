import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { ContentAnnouncementFormModel } from '@/types/modules/content-announcement'

export const urgencyLevelOpts = (t: Translate): UniOption[] => [
  { label: t('content.announcement.urgencyGeneral'), value: 1 },
  { label: t('content.announcement.urgencyUrgent'), value: 2, type: 'danger' }
]

export const activeOpts = (t: Translate): UniOption[] => [
  { label: t('content.announcement.yes'), value: true, type: 'success' },
  { label: t('content.announcement.no'), value: false, type: 'info' }
]

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
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
        placeholder: t('content.announcement.fieldSchool'),
        clearable: true,
        filterable: true
      },
      colProps: { span: 6 }
    }
  ],
  rowProps: { gutter: 8 },
  colProps: { span: 6 }
})

export const tableCols = (
  t: Translate,
  urgencyOptions: UniOption[],
  visibleOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 88, fixed: 'left' },
  {
    prop: 'schoolName',
    label: t('content.announcement.fieldSchool'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'cnContent',
    label: t('content.announcement.fieldCnContent'),
    type: 'text',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'enContent',
    label: t('content.announcement.fieldEnContent'),
    type: 'text',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'urgencyLevel',
    label: t('content.announcement.fieldUrgency'),
    type: 'tag',
    options: urgencyOptions,
    width: 110
  },
  {
    prop: 'active',
    label: t('content.announcement.fieldVisible'),
    type: 'tag',
    options: visibleOptions,
    width: 100
  },
  {
    prop: 'updatedAt',
    label: t('content.announcement.fieldUpdatedAt'),
    type: 'text',
    width: 168
  }
]

export const dialogFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  urgencyOptions: UniOption[],
  visibleOptions: UniOption[],
  isReadonly: boolean
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 0 },
  colProps: { span: 24 },
  schema: [
    {
      field: 'schoolId',
      label: t('content.announcement.fieldSchool'),
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: {
        placeholder: t('content.announcement.phSelect'),
        clearable: true,
        filterable: true,
        disabled: isReadonly,
        style: { width: '100%' }
      }
    },
    {
      field: 'cnContent',
      label: t('content.announcement.fieldCnContent'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 5,
        maxlength: 200,
        showWordLimit: true,
        disabled: isReadonly
      }
    },
    {
      field: 'enContent',
      label: t('content.announcement.fieldEnContent'),
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 5,
        maxlength: 200,
        showWordLimit: true,
        disabled: isReadonly
      }
    },
    {
      field: 'urgencyLevel',
      label: t('content.announcement.fieldUrgency'),
      component: 'ElRadioGroup',
      options: urgencyOptions,
      componentProps: { disabled: isReadonly }
    },
    {
      field: 'active',
      label: t('content.announcement.fieldVisible'),
      component: 'ElRadioGroup',
      options: visibleOptions.map((item) => ({
        ...item,
        value: item.value ? '1' : '0',
        label: item.label
      })),
      componentProps: { disabled: isReadonly }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  schoolId: [{ required: true, message: t('content.announcement.ruleSchool'), trigger: 'change' }],
  cnContent: [
    { required: true, message: t('content.announcement.ruleCnContent'), trigger: 'blur' }
  ],
  enContent: [
    { required: true, message: t('content.announcement.ruleEnContent'), trigger: 'blur' }
  ],
  urgencyLevel: [
    { required: true, message: t('content.announcement.ruleUrgency'), trigger: 'change' }
  ],
  active: [{ required: true, message: t('content.announcement.ruleVisible'), trigger: 'change' }]
})

export const emptyFormModel = (): ContentAnnouncementFormModel => ({
  urgencyLevel: 1,
  active: '0'
})
