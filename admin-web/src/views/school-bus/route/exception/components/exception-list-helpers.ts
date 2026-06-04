import type { Translate } from '@/types/i18n'
import type { ExceptionRecord } from '@/types/modules/school-bus-exception'
import type { UniFormConfig, UniOption } from 'uni-ui-lib'
import dayjs from 'dayjs'

import { exceptionTypeMeta, yesNoMeta } from '../list.config'
import { normalizeSchoolIdsOnRow } from '@/utils/school-bus'

type Loose = Record<string, unknown>

/** 异常列表行展示字段格式化 */
export const formatExceptionRow = (
  row: ExceptionRecord,
  locale: string,
  exceptionOpts: { value: string; label: string }[],
  yesNoOpts: { value: string; label: string }[]
): ExceptionRecord => {
  const sectionName =
    locale === 'en'
      ? String(row.sectionEnName ?? row.sectionName ?? '')
      : String(row.sectionCnName ?? row.sectionName ?? '')
  const next: ExceptionRecord = { ...row }
  normalizeSchoolIdsOnRow(next as Loose)
  next.sectionName = sectionName || '--'
  next.exceptionTypeLabel =
    exceptionOpts.find((x) => String(x.value) === String(row.exceptionType))?.label ??
    String(row.exceptionType ?? '--')
  next.needDispatchLabel =
    yesNoOpts.find((x) => String(x.value) === String(row.needDispatch))?.label ??
    String(row.needDispatch ?? '--')
  next.exceptionDate = row.exceptionDate
    ? dayjs(String(row.exceptionDate)).format('YYYY-MM-DD')
    : '--'
  next.createTime = row.createTime ? dayjs(String(row.createTime)).format('YYYY-MM-DD HH:mm') : '--'
  return next
}

export type ExceptionSearchFormParams = {
  t: Translate
  multiSchool: boolean
  schoolOptions: UniOption[]
  sectionOptions: UniOption[]
  lineOptions: UniOption[]
  carOptions: UniOption[]
  exceptionTypeOptions: UniOption[]
  yesNoOptions: UniOption[]
}

/** 异常列表搜索表单 schema（依赖运行时选项，不放入 list.config） */
export const buildExceptionSearchForm = (params: ExceptionSearchFormParams): UniFormConfig => {
  const {
    t,
    multiSchool,
    schoolOptions,
    sectionOptions,
    lineOptions,
    carOptions,
    exceptionTypeOptions,
    yesNoOptions
  } = params

  const schoolSchema = multiSchool
    ? [
        {
          field: 'schoolIds',
          label: '',
          component: 'ElSelect' as const,
          options: schoolOptions,
          componentProps: {
            placeholder: t('schoolBus.routeException.phSchool'),
            clearable: true,
            filterable: true,
            multiple: true,
            collapseTags: true,
            collapseTagsTooltip: true
          },
          colProps: { span: 6 }
        }
      ]
    : []

  return {
    schema: [
      ...schoolSchema,
      {
        field: 'sectionId',
        label: '',
        component: 'ElSelect',
        options: sectionOptions,
        componentProps: {
          placeholder: t('schoolBus.routeException.phSection'),
          clearable: true,
          filterable: true
        },
        colProps: { span: 6 }
      },
      {
        field: 'lineIds',
        label: '',
        component: 'ElSelect',
        options: lineOptions,
        componentProps: {
          placeholder: t('schoolBus.routeException.phLine'),
          clearable: true,
          filterable: true,
          multiple: true,
          collapseTags: true,
          collapseTagsTooltip: true
        },
        colProps: { span: 6 }
      },
      {
        field: 'carId',
        label: '',
        component: 'ElSelect',
        options: carOptions,
        componentProps: {
          placeholder: t('schoolBus.routeException.phCar'),
          clearable: true,
          filterable: true
        },
        colProps: { span: 6 }
      },
      {
        field: 'exceptionType',
        label: '',
        component: 'ElSelect',
        options: exceptionTypeOptions,
        componentProps: {
          placeholder: t('schoolBus.routeException.phExceptionType'),
          clearable: true
        },
        colProps: { span: 6 }
      },
      {
        field: 'needDispatch',
        label: '',
        component: 'ElSelect',
        options: yesNoOptions,
        componentProps: {
          placeholder: t('schoolBus.routeException.phNeedDispatch'),
          clearable: true
        },
        colProps: { span: 6 }
      },
      {
        field: 'exceptionDateStart',
        label: '',
        component: 'ElDatePicker',
        componentProps: {
          type: 'date',
          placeholder: t('schoolBus.routeException.phExceptionDateStart'),
          valueFormat: 'YYYY-MM-DD',
          clearable: true
        },
        colProps: { span: 6 }
      },
      {
        field: 'exceptionDateEnd',
        label: '',
        component: 'ElDatePicker',
        componentProps: {
          type: 'date',
          placeholder: t('schoolBus.routeException.phExceptionDateEnd'),
          valueFormat: 'YYYY-MM-DD',
          clearable: true
        },
        colProps: { span: 6 }
      }
    ],
    rowProps: { gutter: 8 },
    colProps: { span: 6 }
  }
}

export const exceptionMetaOptions = (t: Translate) => ({
  exception: exceptionTypeMeta(t).map((x) => ({ value: String(x.value), label: x.label })),
  yesNo: yesNoMeta(t).map((x) => ({ value: String(x.value), label: x.label }))
})
