import type { UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 异常类型（旧 `consts.exceptionType`）。 */
export const exceptionTypeMeta = (t: Translate): UniOption[] => [
  { label: t('schoolBus.routeException.exceptionType.behavior'), value: '0' },
  { label: t('schoolBus.routeException.exceptionType.vehicle'), value: '1' }
]

/** 是否（旧 `consts.isOrNo`）。 */
export const yesNoMeta = (t: Translate): UniOption[] => [
  { label: t('schoolBus.routeException.options.yes'), value: '1' },
  { label: t('schoolBus.routeException.options.no'), value: '0' }
]

export const createExceptionColumns = (
  t: Translate,
  schoolOptions: UniOption[]
): UniTableColumn[] => [
  { prop: 'id', label: t('schoolBus.routeException.columns.id'), width: 88, fixed: 'left' },
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
    label: t('schoolBus.routeException.columns.sectionName'),
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'lineName',
    label: t('schoolBus.routeException.columns.lineName'),
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'carNumber',
    label: t('schoolBus.routeException.columns.carNumber'),
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'driver',
    label: t('schoolBus.routeException.columns.driver'),
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'teacher',
    label: t('schoolBus.routeException.columns.teacher'),
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'exceptionTypeLabel',
    label: t('schoolBus.routeException.columns.exceptionTypeLabel'),
    width: 120
  },
  { prop: 'exceptionDate', label: t('schoolBus.routeException.columns.exceptionDate'), width: 140 },
  {
    prop: 'needDispatchLabel',
    label: t('schoolBus.routeException.columns.needDispatchLabel'),
    width: 100
  },
  {
    prop: 'dispatchCarNumber',
    label: t('schoolBus.routeException.columns.dispatchCarNumber'),
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'dispatchDriver',
    label: t('schoolBus.routeException.columns.dispatchDriver'),
    minWidth: 100,
    showOverflowTooltip: true
  },
  { prop: 'createTime', label: t('schoolBus.routeException.columns.createTime'), width: 160 },
  {
    prop: 'details',
    label: t('schoolBus.routeException.columns.details'),
    minWidth: 160,
    showOverflowTooltip: true
  }
]
