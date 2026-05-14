import type { UniFormConfig, UniTableAction, UniTableColumn, UniTableRequest } from 'uni-ui-lib'
import dayjs from 'dayjs'
import { toUniOptions, useUniI18n, useUniListState } from 'uni-ui-lib'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'

import { schoolBusSectionApi } from '@/api'
import { normalizePaged } from '@/utils/api-response-normalize'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import type { SectionListParams } from '@/types/modules/school-bus-section'

type Loose = Record<string, unknown>
type SchoolRecordsRef = Ref<SchoolOptionRecord[]>

const normalizeSchoolIdsField = (row: Loose): void => {
  if (row.schoolIds == null && row.schoolId != null) {
    row.schoolIds = [row.schoolId as string | number]
  }

  const raw = row.schoolIds

  if (Array.isArray(raw)) {
    row.schoolIds = raw.filter((x) => x !== '' && x != null) as Array<string | number>

    return
  }

  if (raw == null || raw === '') {
    row.schoolIds = []

    return
  }

  if (typeof raw === 'string' && raw.includes(',')) {
    row.schoolIds = raw
      .split(',')
      .map((s) => s.trim())
      .filter((x) => x !== '')

    return
  }

  row.schoolIds = [raw as string | number]
}

const stripEmptyParams = (p: Record<string, unknown>): Record<string, unknown> => {
  const o: Record<string, unknown> = {}

  for (const [k, v] of Object.entries(p)) {
    if (v === '' || v === undefined || v === null) {
      continue
    }

    if (Array.isArray(v) && v.length === 0) {
      continue
    }

    o[k] = v
  }

  return o
}

export const useTermSection = (schoolRecords: SchoolRecordsRef) => {
  const { locale, t } = useUniI18n()

  const initialFilters: Record<string, unknown> = {
    schoolIds: undefined,
    cnName: ''
  }

  const { queryModel, filters, tableRef, search, reset, handleLoadSuccess } = useUniListState({
    initialFilters
  })

  const termFormVisible = ref(false)
  const termEditingId = ref<string | number | null>(null)

  const termDetailVisible = ref(false)
  const termDetailRecord = ref<Loose | null>(null)

  const selection = ref<Loose[]>([])
  const selectedIds = computed(() =>
    selection.value.map((item) => item.id as string | number).filter((id) => id != null && id !== '')
  )

  const schoolOptions = computed(() =>
    toUniOptions(schoolRecords.value, {
      labelKeys: locale() === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
      valueKey: 'id'
    })
  )

  const multiSchool = computed(() => schoolRecords.value.length > 1)
  const defaultSchoolId = computed(() =>
    schoolRecords.value.length === 1 ? schoolRecords.value[0].id : null
  )

  const searchCfg = computed<UniFormConfig>(() => {
    const schoolSchema = multiSchool.value
      ? [
          {
            field: 'schoolIds',
            label: '',
            component: 'ElSelect' as const,
            options: schoolOptions.value,
            componentProps: {
              placeholder: t('schoolBus.routeOperation.placeholders.school'),
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
          field: 'cnName',
          label: '',
          component: 'ElInput',
          componentProps: {
            placeholder: t('schoolBus.routePlan.placeholders.termKeyword'),
            clearable: true
          },
          colProps: { span: 6 }
        }
      ],
      rowProps: { gutter: 16 },
      colProps: { span: 6 }
    }
  })

  const fmtRowTerm = (row: Loose) => {
    normalizeSchoolIdsField(row)
    const loc = locale()
    row.showTermName = loc === 'en' ? row.enName : row.cnName
    row.intentStartDate = row.intentStartDate
      ? dayjs(String(row.intentStartDate)).format('YYYY-MM-DD')
      : '--'
    row.intentEndDate = row.intentEndDate
      ? dayjs(String(row.intentEndDate)).format('YYYY-MM-DD')
      : '--'
    row.serviceStartDate = row.serviceStartDate
      ? dayjs(String(row.serviceStartDate)).format('YYYY-MM-DD')
      : '--'
    row.serviceEndDate = row.serviceEndDate
      ? dayjs(String(row.serviceEndDate)).format('YYYY-MM-DD')
      : '--'
    row.createTime = row.createTime
      ? dayjs(String(row.createTime)).format('YYYY-MM-DD HH:mm')
      : '--'

    return row
  }

  const termColumns = computed<UniTableColumn[]>(() => [
    { prop: 'id', label: 'ID', width: 88, fixed: 'left' },
    {
      prop: 'schoolIds',
      label: t('schoolBus.driver.fields.school'),
      type: 'array',
      options: schoolOptions.value,
      lookup: { splitValues: true },
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      prop: 'showTermName',
      label: t('schoolBus.routeOperation.columns.sectionName'),
      minWidth: 140
    },
    { prop: 'intentStartDate', label: t('schoolBus.routePlan.term.intentStart'), width: 140 },
    { prop: 'intentEndDate', label: t('schoolBus.routePlan.term.intentEnd'), width: 140 },
    { prop: 'serviceStartDate', label: t('schoolBus.routePlan.term.serviceStart'), width: 140 },
    { prop: 'serviceEndDate', label: t('schoolBus.routePlan.term.serviceEnd'), width: 140 },
    { prop: 'createTime', label: t('schoolBus.routeOperation.columns.createTime'), width: 160 }
  ])

  const loadTerms: UniTableRequest = async ({ pageNo, pageSize, filters: f }) => {
    const raw = (f ?? {}) as SectionListParams
    const base: Record<string, unknown> = {
      current: pageNo,
      size: pageSize,
      ...raw
    }

    if (!multiSchool.value && defaultSchoolId.value != null && base.schoolIds == null) {
      base.schoolIds = defaultSchoolId.value
    }

    const params = stripEmptyParams(base)
    const result = await schoolBusSectionApi.page.get(params)
    const { list, total } = normalizePaged<Loose>(result)

    return {
      data: list.map((r) => fmtRowTerm({ ...r })),
      total
    }
  }

  const openTermDetail = (row: Loose) => {
    termDetailRecord.value = row
    termDetailVisible.value = true
  }

  const openTermEdit = (row: Loose) => {
    termEditingId.value = row.id as string | number
    termFormVisible.value = true
  }

  const openTermAdd = () => {
    termEditingId.value = null
    termFormVisible.value = true
  }

  const actions = computed<UniTableAction[]>(() => [
    {
      label: t('schoolBus.look'),
      onClick: (row) => openTermDetail(row as Loose)
    },
    {
      label: t('schoolBus.edit'),
      code: 'bussection_edit',
      onClick: (row) => openTermEdit(row as Loose)
    }
  ])

  const onSelectionChange = (rows: Loose[]) => {
    selection.value = rows
  }

  const deleteTermsSelected = async () => {
    const ids = selectedIds.value

    if (ids.length === 0) {
      ElMessage.warning(t('schoolBus.routePlan.messages.selectTermsFirst'))
      return
    }

    try {
      await ElMessageBox.confirm(
        t('schoolBus.routePlan.messages.confirmDeleteTerms'),
        t('schoolBus.delete'),
        { type: 'warning' }
      )
    } catch {
      return
    }

    try {
      await schoolBusSectionApi.delete.delete(ids)
      ElMessage.success(t('schoolBus.deleteSuccess'))
      tableRef.value?.refresh()
      selection.value = []
    } catch {
      /* request 层已提示 */
    }
  }

  watch(
    () => schoolRecords.value,
    (records) => {
      if (records.length === 1) {
        queryModel.schoolIds = records[0].id
      }
    }
  )

  return {
    actions,
    columns: termColumns,
    defaultSchoolId,
    deleteTermsSelected,
    filters,
    handleLoadSuccess,
    loadTerms,
    multiSchool,
    onSelectionChange,
    openTermAdd,
    queryModel,
    reset,
    search,
    searchCfg,
    selectedIds,
    tableRef,
    termDetailRecord,
    termDetailVisible,
    termEditingId,
    termFormVisible
  }
}
