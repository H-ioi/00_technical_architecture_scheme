import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { ContentDiscussionLikeSaveFormModel } from '@/types/modules/content-discussion-like-save'

export const boolRadioOpts = (t: Translate): UniOption[] => [
  { label: t('content.yes'), value: true },
  { label: t('content.no'), value: false }
]

export const boolTagOpts = (t: Translate): UniOption[] => [
  { label: t('content.yes'), value: true, type: 'success' },
  { label: t('content.no'), value: false, type: 'info' }
]

export const tableCols = (t: Translate, boolOptions: UniOption[]): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 88, fixed: 'left' },
  {
    prop: 'discussionId',
    label: t('content.discussionLikeSave.fieldDiscussionId'),
    type: 'text',
    width: 120
  },
  {
    prop: 'parentId',
    label: t('content.discussionLikeSave.fieldParentId'),
    type: 'text',
    width: 120
  },
  {
    prop: 'favor',
    label: t('content.discussionLikeSave.fieldFavor'),
    type: 'tag',
    options: boolOptions,
    width: 100
  },
  {
    prop: 'like',
    label: t('content.discussionLikeSave.fieldLike'),
    type: 'tag',
    options: boolOptions,
    width: 100
  },
  {
    prop: 'createdAt',
    label: t('content.discussionLikeSave.fieldCreatedAt'),
    type: 'text',
    width: 168
  },
  {
    prop: 'updatedAt',
    label: t('content.discussionLikeSave.fieldUpdatedAt'),
    type: 'text',
    width: 168
  }
]

export const dialogFormConfig = (
  t: Translate,
  discussionOptions: UniOption[],
  boolOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 20 },
  colProps: { span: 12 },
  schema: [
    {
      field: 'discussionId',
      label: t('content.discussionLikeSave.fieldDiscussion'),
      component: 'ElSelect',
      options: discussionOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('content.discussionLikeSave.phSelect') },
      colProps: { span: 24 }
    },
    {
      field: 'parentId',
      label: t('content.discussionLikeSave.fieldParentId'),
      component: 'ElInputNumber',
      componentProps: { min: 0, step: 1, precision: 0, style: { width: '100%' } },
      colProps: { span: 24 }
    },
    {
      field: 'like',
      label: t('content.discussionLikeSave.fieldLike'),
      component: 'ElRadioGroup',
      options: boolOptions,
      colProps: { span: 12 }
    },
    {
      field: 'favor',
      label: t('content.discussionLikeSave.fieldFavor'),
      component: 'ElRadioGroup',
      options: boolOptions,
      colProps: { span: 12 }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  discussionId: [{ required: true, message: t('content.discussionLikeSave.ruleDiscussion'), trigger: 'change' }],
  parentId: [{ required: true, message: t('content.discussionLikeSave.ruleParentId'), trigger: 'change' }]
})

export const emptyFormModel = (): ContentDiscussionLikeSaveFormModel => ({
  parentId: 0,
  like: false,
  favor: false
})
