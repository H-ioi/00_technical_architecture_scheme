import type { UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'
import { dateFormat } from '@/utils/tool'

export const prizeBindColumns = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', minWidth: 88 },
  { prop: 'cnName', label: t('activity.prizeCnName'), minWidth: 130 },
  { prop: 'enName', label: t('activity.prizeEnName'), minWidth: 130 },
  { prop: 'amount', label: t('activity.prizeAmount'), minWidth: 100 },
  {
    prop: 'imageUrl',
    label: t('activity.prizeImage'),
    type: 'image',
    width: 88,
    image: { width: 44, height: 44, preview: true }
  }
]

export const poolFileColumns = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', minWidth: 88 },
  { prop: 'fileName', label: t('activity.poolFileName'), minWidth: 200 },
  {
    prop: 'updateTime',
    label: t('activity.colUpdateTime'),
    minWidth: 156,
    formatter: (row) => dateFormat(String(row.updateTime ?? ''))
  }
]

export const voteBindColumns = (t: Translate): UniTableColumn[] => [
  { prop: 'id', label: 'ID', minWidth: 88 },
  { prop: 'cnName', label: t('activity.eventNameCn'), minWidth: 130 },
  { prop: 'enName', label: t('activity.eventNameEn'), minWidth: 130 },
  {
    prop: 'performer',
    label: t('activity.votePerformer'),
    minWidth: 180,
    showOverflowTooltip: true
  }
]

export const poolMemberColumns = (t: Translate): UniTableColumn[] => [
  { prop: 'name', label: t('activity.poolMemberName'), minWidth: 100 },
  { prop: 'phone', label: t('activity.poolMemberPhone'), minWidth: 120 },
  { prop: 'ticketEmail', label: t('activity.poolMemberEmail'), minWidth: 160 },
  {
    prop: 'createTime',
    label: t('activity.colCreateTime'),
    minWidth: 170,
    formatter: (row) => dateFormat(String(row.createTime ?? ''))
  }
]
