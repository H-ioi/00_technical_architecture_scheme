import type { Translate } from '@/types/i18n'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

import { formatMailGroupScopeDisplay } from '../mail-page-utils'

export const yesNoOpts = (t: Translate): UniOption[] => [
  { label: t('email.yes'), value: '1' },
  { label: t('email.no'), value: '0' }
]

export const statusOpts = (t: Translate): UniOption[] => [
  { label: t('email.statusActive'), value: '1' },
  { label: t('email.statusArchived'), value: '0' }
]

export const searchForm = (t: Translate, yn: UniOption[], st: UniOption[]): UniFormConfig => ({
  rowProps: { gutter: 8 },
  schema: [
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('email.group.keywordPlaceholder') },
      colProps: { span: 5 }
    },
    {
      field: 'status',
      label: '',
      component: 'ElSelect',
      options: st,
      componentProps: { clearable: true, placeholder: t('email.status') },
      colProps: { span: 4 }
    },
    {
      field: 'includeParentMails',
      label: '',
      component: 'ElSelect',
      options: yn,
      componentProps: { clearable: true, placeholder: t('email.group.colParentMail') },
      colProps: { span: 5 }
    },
    {
      field: 'includeStudentMails',
      label: '',
      component: 'ElSelect',
      options: yn,
      componentProps: { clearable: true, placeholder: t('email.group.colStudentMail') },
      colProps: { span: 5 }
    }
  ]
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 72 },
  {
    prop: 'name',
    label: t('email.group.colName'),
    type: 'text',
    minWidth: 140,
    showOverflowTooltip: true
  },
  {
    prop: 'scopes',
    label: t('email.group.colScopes'),
    type: 'text',
    minWidth: 200,
    showOverflowTooltip: true,
    formatter: (row) => {
      const s = String((row as { scopes?: string }).scopes ?? '')
      if (!s) {
        return '—'
      }
      const parts = s.split(';').filter((x) => x.trim())
      const head = parts.slice(0, 2).map(formatMailGroupScopeDisplay)
      return head.join('；') + (parts.length > 2 ? '…' : '')
    }
  },
  {
    prop: 'includeParentMails',
    label: t('email.group.colParentMail'),
    type: 'text',
    width: 120,
    formatter: (_r, _c, v) => (Number(v) === 1 || v === true ? t('email.yes') : t('email.no'))
  },
  {
    prop: 'includeStudentMails',
    label: t('email.group.colStudentMail'),
    type: 'text',
    width: 120,
    formatter: (_r, _c, v) => (Number(v) === 1 || v === true ? t('email.yes') : t('email.no'))
  },
  {
    prop: 'status',
    label: t('email.status'),
    type: 'text',
    width: 100,
    formatter: (_r, _c, v) =>
      String(v) === '1' ? t('email.statusActive') : t('email.statusArchived')
  },
  {
    prop: 'createdAt',
    label: t('email.createdAt'),
    type: 'datetime',
    minWidth: 170
  }
]
