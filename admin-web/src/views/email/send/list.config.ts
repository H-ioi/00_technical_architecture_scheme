import type { Translate } from '@/types/i18n'
import type { UniFormConfig, UniOption, UniTableColumn } from 'uni-ui-lib'

export const emailSendStatusOpts = (t: Translate): UniOption[] => [
  { label: t('email.statusActive'), value: '1' },
  { label: t('email.statusArchived'), value: '0' }
]

export const emailSendSearchForm = (_t: Translate, statusOpts: UniOption[]): UniFormConfig => ({
  rowProps: { gutter: 16 },
  schema: [
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: {
        clearable: true,
        placeholder: _t('email.send.keywordPlaceholder')
      },
      colProps: { span: 6 }
    },
    {
      field: 'status',
      label: '',
      component: 'ElSelect',
      options: statusOpts,
      componentProps: {
        clearable: true,
        placeholder: _t('email.status')
      },
      colProps: { span: 5 }
    }
  ]
})

export const emailSendColumns = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', type: 'text', width: 72 },
  { prop: 'email', label: t('email.send.colEmail365'), type: 'text', minWidth: 200, showOverflowTooltip: true },
  { prop: 'usernames', label: t('email.send.colUsers'), type: 'text', minWidth: 160, showOverflowTooltip: true },
  {
    prop: 'status',
    label: t('email.status'),
    type: 'text',
    width: 100,
    formatter: (_row, _c, v) => {
      const n = Number(v)
      if (n === 0) {
        return t('email.statusArchived')
      }
      if (n === 1) {
        return t('email.statusActive')
      }
      return String(v ?? '—')
    }
  },
  {
    prop: 'createdAt',
    label: t('email.createdAt'),
    type: 'datetime',
    minWidth: 170,
    showOverflowTooltip: true
  }
]
