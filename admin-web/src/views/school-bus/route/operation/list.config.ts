import type { UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 路线运营表格列（对齐旧 `tabletitle.operationTable`）。 */
export const operationStatusMeta = (t: Translate): UniOption[] => [
  { label: t('schoolBus.routeOperation.statusEarly'), value: '0' },
  { label: t('schoolBus.routeOperation.statusOnTime'), value: '1' },
  { label: t('schoolBus.routeOperation.statusLate'), value: '2' },
  { label: t('schoolBus.routeOperation.statusArrive'), value: '3' }
]

export const tableCols = (t: Translate, schoolOptions: UniOption[]): UniTableColumn[] => [
  { prop: 'id', label: t('schoolBus.routeOperation.colId'), width: 88, fixed: 'left' },
  {
    prop: 'statusLabel',
    label: t('schoolBus.routeOperation.colStatus'),
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'arrivalStatusLabel',
    label: t('schoolBus.routeOperation.colArrivalStatusLabel'),
    minWidth: 108,
    showOverflowTooltip: true
  },
  {
    prop: 'schoolIds',
    label: t('schoolBus.driver.fieldSchool'),
    type: 'array',
    options: schoolOptions,
    lookup: { splitValues: true },
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'sectionName',
    label: t('schoolBus.routeOperation.colSectionName'),
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'carNumber',
    label: t('schoolBus.routeOperation.colCarNumber'),
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'carTeacher',
    label: t('schoolBus.routeOperation.colCarTeacher'),
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'lineName',
    label: t('schoolBus.routeOperation.colLineName'),
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'stationName',
    label: t('schoolBus.routeOperation.colStationName'),
    minWidth: 120,
    showOverflowTooltip: true
  },
  { prop: 'rideDate', label: t('schoolBus.routeOperation.colRideDate'), width: 120 },
  { prop: 'arrivalTime', label: t('schoolBus.routeOperation.colArrivalTime'), width: 160 },
  { prop: 'createTime', label: t('schoolBus.routeOperation.colCreateTime'), width: 160 },
  { prop: 'updateTime', label: t('schoolBus.routeOperation.colUpdateTime'), width: 160 },
  {
    prop: 'remark',
    label: t('schoolBus.routeOperation.colRemark'),
    minWidth: 140,
    showOverflowTooltip: true
  }
]
