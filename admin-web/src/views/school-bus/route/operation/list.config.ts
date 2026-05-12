import type { UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 路线运营表格列（对齐旧 `tabletitle.operationTable`）。 */
export const operationStatusMeta = (t: Translate): UniOption[] => [
  { label: t('schoolBus.routeOperation.status.early'), value: '0' },
  { label: t('schoolBus.routeOperation.status.onTime'), value: '1' },
  { label: t('schoolBus.routeOperation.status.late'), value: '2' },
  { label: t('schoolBus.routeOperation.status.arrive'), value: '3' }
]

export const createOperationColumns = (
  t: Translate,
  schoolOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: t('schoolBus.routeOperation.columns.id'), width: 88, fixed: 'left' },
  {
    prop: 'statusLabel',
    label: t('schoolBus.routeOperation.columns.statusLabel'),
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'arrivalStatusLabel',
    label: t('schoolBus.routeOperation.columns.arrivalStatusLabel'),
    minWidth: 108,
    showOverflowTooltip: true
  },
  {
    prop: 'schoolIds',
    label: t('schoolBus.driver.fields.school'),
    type: 'array',
    options: schoolOptions,
    lookup: { splitValues: true },
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'sectionName',
    label: t('schoolBus.routeOperation.columns.sectionName'),
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'carNumber',
    label: t('schoolBus.routeOperation.columns.carNumber'),
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'carTeacher',
    label: t('schoolBus.routeOperation.columns.carTeacher'),
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'lineName',
    label: t('schoolBus.routeOperation.columns.lineName'),
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'stationName',
    label: t('schoolBus.routeOperation.columns.stationName'),
    minWidth: 120,
    showOverflowTooltip: true
  },
  { prop: 'rideDate', label: t('schoolBus.routeOperation.columns.rideDate'), width: 120 },
  { prop: 'arrivalTime', label: t('schoolBus.routeOperation.columns.arrivalTime'), width: 160 },
  { prop: 'createTime', label: t('schoolBus.routeOperation.columns.createTime'), width: 160 },
  { prop: 'updateTime', label: t('schoolBus.routeOperation.columns.updateTime'), width: 160 },
  {
    prop: 'remark',
    label: t('schoolBus.routeOperation.columns.remark'),
    minWidth: 140,
    showOverflowTooltip: true
  }
]
