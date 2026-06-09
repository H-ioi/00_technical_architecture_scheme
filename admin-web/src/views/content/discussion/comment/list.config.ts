import type { FormRules } from 'element-plus'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import type { ContentDiscussionCommentFormModel } from '@/types/modules/content-discussion-comment'

export const visibleRadioOpts = (t: Translate): UniOption[] => [
  { label: t('content.yes'), value: true },
  { label: t('content.no'), value: false }
]

export const tableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 88, fixed: 'left' },
  {
    prop: 'discussionId',
    label: t('content.discussionComment.fieldDiscussionId'),
    type: 'text',
    width: 120
  },
  {
    prop: 'parentId',
    label: t('content.discussionComment.fieldParentId'),
    type: 'text',
    width: 120
  },
  {
    prop: 'content',
    label: t('content.discussionComment.fieldContent'),
    type: 'text',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'createdAt',
    label: t('content.discussionComment.fieldCreatedAt'),
    type: 'text',
    width: 168
  }
]

export const dialogFormConfig = (
  t: Translate,
  discussionOptions: UniOption[],
  visibleOptions: UniOption[]
): UniFormConfig => ({
  formProps: { labelPosition: 'top' },
  rowProps: { gutter: 20 },
  colProps: { span: 24 },
  schema: [
    {
      field: 'discussionId',
      label: t('content.discussionComment.fieldDiscussion'),
      component: 'ElSelect',
      options: discussionOptions,
      componentProps: { clearable: true, filterable: true, placeholder: t('content.discussionComment.phSelect') },
      colProps: { span: 24 }
    },
    {
      field: 'parentId',
      label: t('content.discussionComment.fieldParentId'),
      component: 'ElInput',
      componentProps: { clearable: true },
      colProps: { span: 24 }
    },
    {
      field: 'content',
      label: t('content.discussionComment.fieldContent'),
      component: 'ElInput',
      componentProps: { type: 'textarea', rows: 4, maxlength: 200, showWordLimit: true },
      colProps: { span: 24 }
    },
    {
      field: 'visible',
      label: t('content.discussionComment.fieldVisible'),
      component: 'ElRadioGroup',
      options: visibleOptions,
      colProps: { span: 24 }
    }
  ]
})

export const dialogFormRules = (t: Translate): FormRules => ({
  discussionId: [{ required: true, message: t('content.discussionComment.ruleDiscussion'), trigger: 'change' }],
  parentId: [{ required: true, message: t('content.discussionComment.ruleParentId'), trigger: 'blur' }],
  content: [{ required: true, message: t('content.discussionComment.ruleContent'), trigger: 'blur' }],
  visible: [{ required: true, message: t('content.discussionComment.ruleVisible'), trigger: 'change' }]
})

export const emptyFormModel = (): ContentDiscussionCommentFormModel => ({
  parentId: '',
  content: '',
  visible: true
})
