import type { Translate } from '@/types/i18n'
import type { UniFormConfig, UniTableColumn } from 'uni-ui-lib'

type Loose = Record<string, unknown>

export const searchForm = (t: Translate): UniFormConfig => ({
  rowProps: { gutter: 16 },
  schema: [
    {
      field: 'keyword',
      label: '',
      component: 'ElInput',
      componentProps: { clearable: true, placeholder: t('email.outbox.keywordPlaceholder') },
      colProps: { span: 6 }
    },
    {
      field: 'dateRange',
      label: '',
      component: 'ElDatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        startPlaceholder: t('email.group.dateStart'),
        endPlaceholder: t('email.group.dateEnd')
      },
      colProps: { span: 8 }
    }
  ]
})

export const tableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'subject', label: t('email.outbox.colSubject'), type: 'text', minWidth: 160, showOverflowTooltip: true },
  { prop: 'username', label: t('email.outbox.colUser'), type: 'text', width: 110 },
  { prop: 'email', label: t('email.outbox.colFrom'), type: 'text', minWidth: 160 },
  {
    prop: 'sendResult',
    label: t('email.outbox.colSendStatus'),
    type: 'text',
    width: 160,
    showOverflowTooltip: true,
    formatter: (row, _c, v) => {
      if (Number(v) === 1) {
        return t('email.outbox.sendOk')
      }
      if (Number(v) === 0) {
        const detail = String((row as Loose).sendDetails ?? '')
        return `${t('email.outbox.sendFail')}${detail ? ` 【${detail}】` : ''}`
      }
      return String(v ?? '—')
    }
  },
  { prop: 'createdAt', label: t('email.outbox.colSentAt'), type: 'datetime', minWidth: 170 }
]

export const draftTableCols = (t: Translate): UniTableColumn[] => [
  { prop: 'subject', label: t('email.outbox.colSubject'), type: 'text', minWidth: 160, showOverflowTooltip: true },
  { prop: 'username', label: t('email.outbox.colUser'), type: 'text', width: 110 },
  { prop: 'email', label: t('email.outbox.colFrom'), type: 'text', minWidth: 160 }
]
