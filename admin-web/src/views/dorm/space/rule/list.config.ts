import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { DormAssignRuleFormModel } from '@/types/modules/dorm-assign-rule'

import { activeFilterOpts } from '../building/list.config'

export const activeStatusOpts = activeFilterOpts

export const searchForm = (
  t: Translate,
  schoolOptions: UniOption[],
  statusOptions: UniOption[],
  defaultSchoolId?: string | number
): UniFormConfig => ({
  rowProps: { gutter: 8 },
  schema: [
    {
      field: 'schoolId',
      label: '',
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('dorm.rule.phSchool') },
      defaultValue: defaultSchoolId,
      colProps: { span: 6 }
    },
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('dorm.rule.phName') },
      colProps: { span: 6 }
    },
    {
      field: 'isActive',
      label: '',
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { clearable: true, placeholder: t('dorm.rule.phStatus') },
      colProps: { span: 6 }
    }
  ]
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  {
    prop: 'school_en_name',
    label: t('dorm.rule.fieldSchool'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'ruleName',
    label: t('dorm.rule.fieldName'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'ruleItems',
    label: t('dorm.rule.fieldRuleItems'),
    type: 'text',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'statusLabel',
    label: t('dorm.rule.fieldStatus'),
    type: 'text',
    width: 100,
    align: 'center'
  }
]

export const dialogFormConfig = (
  t: Translate,
  schoolOptions: UniOption[],
  statusOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 20 },
  colProps: { span: 24 },
  schema: [
    {
      field: 'schoolId',
      label: t('dorm.rule.fieldSchool'),
      component: 'ElSelect',
      options: schoolOptions,
      componentProps: { filterable: true, placeholder: t('dorm.rule.phSchool') },
      colProps: { span: 24 }
    },
    {
      field: 'ruleName',
      label: t('dorm.rule.fieldName'),
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('dorm.rule.phRuleName') },
      colProps: { span: 24 }
    },
    {
      field: 'is_active',
      label: t('dorm.rule.fieldStatus'),
      component: 'ElSelect',
      options: statusOptions,
      componentProps: { placeholder: t('dorm.rule.phStatus') },
      colProps: { span: 24 }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  schoolId: [{ required: true, message: t('dorm.rule.ruleSchool'), trigger: 'change' }],
  ruleName: [{ required: true, message: t('dorm.rule.ruleName'), trigger: 'blur' }],
  is_active: [{ required: true, message: t('dorm.rule.ruleStatus'), trigger: 'change' }]
})

export const emptyFormModel = (): DormAssignRuleFormModel => ({
  ruleName: '',
  rulesList: [''],
  is_active: '1'
})
