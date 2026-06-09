import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { ContentDiscussionTagFormModel } from '@/types/modules/content-discussion-tag'

export const tableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 88, fixed: 'left' },
  {
    prop: 'cnName',
    label: t('content.discussionTag.fieldCnName'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'enName',
    label: t('content.discussionTag.fieldEnName'),
    type: 'text',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'createdAt',
    label: t('content.discussionTag.fieldCreatedAt'),
    type: 'text',
    width: 168
  },
  {
    prop: 'updatedAt',
    label: t('content.discussionTag.fieldUpdatedAt'),
    type: 'text',
    width: 168
  }
]

export const dialogFormConfig = (t: Translate): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 20 },
  colProps: { span: 12 },
  schema: [
    {
      field: 'cnName',
      label: t('content.discussionTag.fieldCnName'),
      component: 'ElInput',
      componentProps: { maxlength: 100, clearable: true },
      colProps: { span: 12 }
    },
    {
      field: 'enName',
      label: t('content.discussionTag.fieldEnName'),
      component: 'ElInput',
      componentProps: { maxlength: 100, clearable: true },
      colProps: { span: 12 }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  cnName: [{ required: true, message: t('content.discussionTag.ruleCnName'), trigger: 'blur' }],
  enName: [{ required: true, message: t('content.discussionTag.ruleEnName'), trigger: 'blur' }]
})

export const emptyFormModel = (): ContentDiscussionTagFormModel => ({
  cnName: '',
  enName: ''
})
