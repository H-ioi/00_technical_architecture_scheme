import type { UniOption, UniTableColumn } from 'uni-ui-lib'

import type { Translate } from '@/types/i18n'

/** 异常类型（旧 `consts.exceptionType`）。 */
export const exceptionTypeMeta = (t: Translate): UniOption[] => [
  { label: t('schoolBus.routeException.excTypeBehavior'), value: '0' },
  { label: t('schoolBus.routeException.excTypeVehicle'), value: '1' }
]

/** 是否（旧 `consts.isOrNo`）。 */
export const yesNoMeta = (t: Translate): UniOption[] => [
  { label: t('schoolBus.routeException.optYes'), value: '1' },
  { label: t('schoolBus.routeException.optNo'), value: '0' }
]

export const tableCols = (t: Translate, schoolOptions: UniOption[]): UniTableColumn[] => [
  { prop: 'id', label: t('schoolBus.routeException.colId'), width: 88, fixed: 'left' },
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
    label: t('schoolBus.routeException.colSectionName'),
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'lineName',
    label: t('schoolBus.routeException.colLineName'),
    minWidth: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'carNumber',
    label: t('schoolBus.routeException.colCarNumber'),
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'driver',
    label: t('schoolBus.routeException.colDriver'),
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'teacher',
    label: t('schoolBus.routeException.colTeacher'),
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'exceptionTypeLabel',
    label: t('schoolBus.routeException.colExceptionTypeLabel'),
    width: 120
  },
  { prop: 'exceptionDate', label: t('schoolBus.routeException.colExceptionDate'), width: 140 },
  {
    prop: 'needDispatchLabel',
    label: t('schoolBus.routeException.colNeedDispatchLabel'),
    width: 100
  },
  {
    prop: 'dispatchCarNumber',
    label: t('schoolBus.routeException.colDispatchCarNumber'),
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'dispatchDriver',
    label: t('schoolBus.routeException.colDispatchDriver'),
    minWidth: 100,
    showOverflowTooltip: true
  },
  { prop: 'createTime', label: t('schoolBus.routeException.colCreateTime'), width: 160 },
  {
    prop: 'details',
    label: t('schoolBus.routeException.colDetails'),
    minWidth: 160,
    showOverflowTooltip: true
  }
]
